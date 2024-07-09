import { writable, derived, get } from "svelte/store";
import type { Writable } from "svelte/store";
import type { ScheduleBlock } from "./Schedule/types";
import type { StudentData } from './StudentGame/types';

function createLocalStorageStore<T>(key: string, startValue: T): Writable<T> {
  const storedValue = localStorage.getItem(key);
  let initialValue = startValue;
  if (storedValue) {
    try {
      initialValue = JSON.parse(storedValue);
    } catch {      
      console.log('Bad value stored',storedValue,'for key',key,'removing')
      localStorage.removeItem(key);
    }
  }  
  const store = writable<T>(initialValue);
  store.subscribe((value) => localStorage.setItem(key, JSON.stringify(value)));
  return store;
}

export let selectedSchedule: Writable<string> = createLocalStorageStore('schedule','');


export type SchoolType = "HS" | "MS" | "All" | null;
export let school: Writable<SchoolType> = createLocalStorageStore('school',"All");

school.subscribe((value) => {
  let $selectedSchedule = get(selectedSchedule);
  console.log('School changed to',value)
  if (value=='HS') {  
    selectedSchedule.set('HS');
  } else if ($selectedSchedule=='HS' && value!='All') {    
    selectedSchedule.set('5/6 Simple');
  }
});

export let prefsSet = derived([school], ([$school]) => {
  let val = !!$school
  console.log('school was ',$school,'return',val;
  return val;
});

export let activeCardIDs : Writable<string[]> = writable([]);

export let hiddenCards : Writable<object> = createLocalStorageStore('hidden',{});
export let customSchedule : Writable<{}> = createLocalStorageStore('customSchedule',{});

export let showPrefs : Writable<boolean> = writable(false);

export function getCustomBlockName (sched : string, block : ScheduleBlock) {
  let custom = get(customSchedule);
  if (!custom[sched]) {
    return null
  } else {
    let customSched = custom[sched];
    if (customSched.byDay && customSched.byDay[block.day]
      && customSched.byDay[block.day][block.name]) {
        return customSched.byDay[block.day][block.name]
    } else if (customSched.byBlock && customSched.byBlock[block.name]) {
      return customSched.byBlock[block.name];
    } else {
      return null;
    }
  }
}

export const students : Writable<StudentData[]> = createLocalStorageStore('students',[]);

export const whimsy : Writable<boolean> = createLocalStorageStore('whimsy',true);
export const preferredCountdownName : Writable<string>= createLocalStorageStore('countdown',undefined);
export const hideCountdown : Writable<boolean> = createLocalStorageStore('hide-countdown',false);

export const collapsedMenus : Writable<{[key: string] : boolean}> = createLocalStorageStore('collapsed-menu-items',{});
export const hiddenMenuItems : Writable<{[key: string] : boolean}> = createLocalStorageStore('hidden-menus',{});

type CSSColor = string;
export const customColors = createLocalStorageStore<{[key : string] : CSSColor }>('custom-colors',{})