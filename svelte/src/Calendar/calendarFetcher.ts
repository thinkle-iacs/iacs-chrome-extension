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
  //  "https://script.google.com/macros/s/AKfycbwMbmd-9KnPDPyK3F-ziSLSSulwIpmvD0bja_s7N-trdiqAZLqgpsSocIAPHirLZb67/exec";
  //"https://script.googleusercontent.com/a/macros/innovationcharter.org/echo?user_content_key=SwsxtJEDe0SPSfNpj7FqbzLpTHJ6FxBNYAIa3NEN2Rwoy43Xk4eCW8yPU7k7W8eM01lZvSeiZ9vJ7mAqvlupvD3yrD6_FAa3m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_nRPgeZU6HP_qJ_FjM1YTCZgGM7afctcXyRFoxRyIhgDryfhECjZEnB0hU6rYZhshprMUtv7ONwemBxAE0-kHcuwfF8_6hAEF7MzLMvz4knGEZWU5C-oY6g&lib=M3kwcctT_0ks6MxTQgCwnKdjhWfrJiBV7";
  //"https://script.google.com/a/macros/innovationcharter.org/s/AKfycbwc_H5Op9Ea5quz8fd2adlkGJaW1kvWeoVIZ4hmcaX9arLnCw1HsayINENRpTSqyNtk/exec";
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
