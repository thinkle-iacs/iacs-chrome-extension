import { writable, derived, get } from "svelte/store";
import type { Writable } from "svelte/store";
import type { ScheduleBlock } from "./Schedule/types";

let initialScheduleString = localStorage.getItem("schedule");

export let selectedSchedule: Writable<string> = writable(initialScheduleString);

selectedSchedule.subscribe((value) => {
  console.log("Look the schedule changed!", value);
  localStorage.setItem("schedule", value);
});

export type SchoolType = "HS" | "MS" | "All" | null;

let initialSchoolValue: SchoolType = localStorage.getItem("school");
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
export let showPrefs : Writable<boolean> = writable(false);