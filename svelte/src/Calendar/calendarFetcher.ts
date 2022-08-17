export type CalendarEvent = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  id: string;
};

export type CalendarData = {
  today: CalendarEvent[];
  tomorrow: CalendarEvent[];
};

let url =
  "https://script.google.com/macros/s/AKfycbwMbmd-9KnPDPyK3F-ziSLSSulwIpmvD0bja_s7N-trdiqAZLqgpsSocIAPHirLZb67/exec?calendar=true";

import { CachedDataStore } from "../util/dataFetcher";

export const calendarFetcher = new CachedDataStore({
  url,
  name: "calendar",
  expiresAfter: 2 * 60 * 60 * 1000,
  defaultValue: { today: [], tomorrow: [] },
});

export async function fetchCalendar() {
  try {
    let request = await fetch(url, { redirect: "follow" });
    let calJson = await request.json();
    console.log("Got JSON", calJson);
    return calJson;
  } catch (err) {
    console.log("Error fetching", url);
    console.log(err);
    console.log(":(");
  }
}
