import type { ScheduleBlock } from "./types";
import { M, T, W, R, F } from "./types";

export let hs_schedule: ScheduleBlock[] = [
  {
    day: M,
    start: "8:10",
    end: "9:28",
    name: "A",
  },
  {
    day: M,
    start: "9:43",
    end: "11:01",
    name: "B",
  },
  {
    day: M,
    start: "11:06",
    end: "12:24",
    name: "C",
  },
  {
    day: M,
    start: "12:29",
    end: "12:53",
    name: "9/10L, 11/12Adv",
  },
  {
    day: M,
    start: "12:58",
    end: "13:22",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: M,
    start: "13:27",
    end: "14:45",
    name: "D",
  },
  // Tuesday
  {
    day: T,
    start: "8:10",
    end: "9:28",
    name: "B",
  },
  {
    day: T,
    start: "9:43",
    end: "11:01",
    name: "E",
  },
  {
    day: T,
    start: "11:06",
    end: "12:24",
    name: "F",
  },
  {
    day: T,
    start: "12:29",
    end: "12:53",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: T,
    start: "12:58",
    end: "13:22",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: T,
    start: "13:27",
    end: "14:45",
    name: "A",
  },
  // Wednesday
  {
    day: W,
    start: "8:10",
    end: "9:28",
    name: "WIN",
  },
  {
    day: W,
    start: "9:43",
    end: "11:01",
    name: "D",
  },
  {
    day: W,
    start: "11:06",
    end: "12:24",
    name: "B",
  },
  {
    day: W,
    start: "12:29",
    end: "12:53",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: W,
    start: "12:58",
    end: "13:22",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: W,
    start: "13:27",
    end: "14:45",
    name: "C",
  },
  // Thursday
  {
    day: R,
    start: "8:10",
    end: "9:28",
    name: "C",
  },
  {
    day: R,
    start: "9:43",
    end: "11:01",
    name: "F",
  },
  {
    day: R,
    start: "11:06",
    end: "12:24",
    name: "E",
  },
  {
    day: R,
    start: "12:29",
    end: "12:53",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: R,
    start: "12:58",
    end: "13:22",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: R,
    start: "13:27",
    end: "14:45",
    name: "A",
  },
  // Friday
  {
    day: F,
    start: "8:10",
    end: "9:28",
    name: "D",
  },
  {
    day: F,
    start: "9:43",
    end: "11:01",
    name: "E",
  },
  {
    day: F,
    start: "11:06",
    end: "12:24",
    name: "F",
  },
  {
    day: F,
    start: "12:29",
    end: "12:53",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: F,
    start: "12:58",
    end: "13:22",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: F,
    start: "13:27",
    end: "14:45",
    name: "Choice",
  },
];
