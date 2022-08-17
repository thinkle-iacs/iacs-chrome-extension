import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { ScheduleBlock } from "./Schedule/types";

let initialScheduleString = localStorage.getItem("schedule");

export let selectedSchedule: Writable<string> = writable(initialScheduleString);

selectedSchedule.subscribe((value) => {
  console.log("Look the schedule changed!", value);
  localStorage.setItem("schedule", value);
});
