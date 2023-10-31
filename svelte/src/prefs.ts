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

let initialScheduleString = localStorage.getItem("schedule");

export let selectedSchedule: Writable<string> = writable(initialScheduleString);

selectedSchedule.subscribe((value) => {
  console.log("Look the schedule changed!", value);
  localStorage.setItem("schedule", value);
});

export type SchoolType = "HS" | "MS" | "All" | null;

let initialSchoolValue: SchoolType = localStorage.getItem("school");
if (!['HS','MS','All'].find((s)=>initialSchoolValue==s) {
  initialSchoolValue = null;
}
export let school: Writable<SchoolType> = writable(initialSchoolValue);

school.subscribe((value) => {
  localStorage.setItem("school", value);
  let $selectedSchedule = get(selectedSchedule);
  console.log('School changed to',value)
  if (value=='HS') {
    console.log('Force sched to HS');
    selectedSchedule.set('HS');
  } else if ($selectedSchedule=='HS' && value!='All') {
    console.log('Force sched to MS');
    selectedSchedule.set('5/6 Simple');
  }
});

export let prefsSet = derived([school], ([$school]) => {
  let val = !!$school
  console.log('school was ',$school,'return',val;
  return val;
});

export let activeCardIDs : Writable<string[]> = writable([]);

let hiddenCardString = localStorage.getItem('hidden');
let initialHiddenCards = {};
if (hiddenCardString) {
  try {
    initialHiddenCards = JSON.parse(hiddenCardString);
  } catch {
    initialHiddenCards = {}
  }
}
export let hiddenCards : Writable<object> = writable(initialHiddenCards);
hiddenCards.subscribe(
  ($value)=>{
    localStorage.setItem('hidden',JSON.stringify($value));
  }
)

export let showPrefs : Writable<boolean> = writable(false);


let initialCustomSchedStringValue = localStorage.getItem('customSchedule');
let initialCustom = {};
if (initialCustomSchedStringValue) {
  try {
    initialCustom = JSON.parse(initialCustomSchedStringValue);
  } catch (err) {
    console.log('Error parsing JSON in',initialCustomSchedStringValue)
  }
}

export let customSchedule : Writable<{}> = writable(initialCustom)

customSchedule.subscribe(
  (value)=>{
    let stringValue = JSON.stringify(value);
    localStorage.setItem('customSchedule',stringValue);
  }
)

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

let initialStudentsText = localStorage.getItem('students');
let initialStudents : StudentData[] = [];
if (initialStudentsText) {
  try {
  initialStudents = JSON.parse(initialStudentsText);
  } catch (err) {
    console.log('Bad value?',initialStudentsText)
  }
}
export const students : Writable<StudentData[]> = writable(initialStudents);

students.subscribe(
  ($students)=>{
    localStorage.setItem('students',JSON.stringify($students));    
  }
)
let originalValue = localStorage.getItem('whimsy');
export const whimsy = writable(true);
whimsy.subscribe(
  ($whimsy) => localStorage.setItem('whimsy',JSON.stringify($whimsy))
);
if (originalValue==null) {
  whimsy.set(true);
} else {
  whimsy.set(JSON.parse(originalValue));
}

let pcdnLocal = localStorage.getItem('countdown');
export const preferredCountdownName : Writable<string>= writable();
preferredCountdownName.subscribe(
  ($name)=>localStorage.setItem('countdown',$name)
);
if (pcdnLocal) {
  preferredCountdownName.set(pcdnLocal)
}

let hcdnLocal = localStorage.getItem('hide-countdown');
export const hideCountdown : Writable<boolean> = writable(false);
hideCountdown.subscribe(
  ($hide)=>localStorage.setItem('hide-countdown',JSON.stringify($hide))
);
if (hcdnLocal) {
  try {
    hideCountdown.set(JSON.parse(hcdnLocal))
  } catch (err) {
    console.log('Error parsing hide countdown value',hcdnLocal);
  }
}

export const collapsedMenus : Writable<{[key: string] : boolean}> = writable({});
export const hiddenMenuItems : Writable<{[key: string] : boolean}> = writable({});

let collapsedLocal = localStorage.getItem('collapsed-menu-items');
let hiddenLocal = localStorage.getItem('hidden-menus');
if (collapsedLocal) {
  try {
    collapsedMenus.set(JSON.parse(collapsedLocal));
  } catch (err) {
    console.log("error parsing localStorage for collapsed menus: ",collapsedLocal);
  }
}
if (hiddenLocal) {
  try {    
    let val = JSON.parse(hiddenLocal)
    if (typeof val == 'object') {
      hiddenMenuItems.set(val)
    }
  } catch (err) {
    console.log("Error parsing local storage hiddenMenuItems",hiddenLocal);
  }
}
collapsedMenus.subscribe(
  ($v)=>localStorage.setItem('collapsed-menu-items',JSON.stringify($v))
);
hiddenMenuItems.subscribe(
  ($v)=>localStorage.setItem('hidden-menus',JSON.stringify($v))
);
type CSSColor = string;
export const customColors = createLocalStorageStore<{[key : string] : CSSColor }>('custom-colors',{})