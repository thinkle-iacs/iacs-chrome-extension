import type { ScheduleBlock } from "./types";
import { M, T, W, R, F } from "./types";

export let hs_schedule: ScheduleBlock[] = [
  {
    day: M,
    start: "8:05",
    end: "9:27",
    name: "A",
  },
  {
    day: M,
    start: "9:40",
    end: "11:02",
    name: "B",
  },
  {
    day: M,
    start: "11:05",
    end: "12:27",
    name: "C",
  },
  {
    day: M,
    start: "12:30",
    end: "12:54",
    name: "9/10L, 11/12Adv",
  },
  {
    day: M,
    start: "12:55",
    end: "13:19",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: M,
    start: "13:19",
    end: "14:44",
    name: "D",
  },
  // Tuesday
  {
    day: T,
    start: "8:05",
    end: "9:27",
    name: "B",
  },
  {
    day: T,
    start: "9:40",
    end: "11:02",
    name: "C",
  },
  {
    day: T,
    start: "11:05",
    end: "12:27",
    name: "E",
  },
  {
    day: T,
    start: "12:30",
    end: "12:54",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: T,
    start: "12:55",
    end: "13:19",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: T,
    start: "13:22",
    end: "14:44",
    name: "F",
  },
  // Wednesday
  {
    day: W,
    start: "8:05",
    end: "9:27",
    name: "D",
  },
  {
    day: W,
    start: "9:40",
    end: "11:02",
    name: "F",
  },
  {
    day: W,
    start: "11:05",
    end: "12:27",
    name: "A",
  },
  {
    day: W,
    start: "12:30",
    end: "12:54",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: W,
    start: "12:55",
    end: "13:19",
    name: "11/12 L, 9/10 Adv",
  },
  // Thursday
  {
    day: R,
    start: "8:05",
    end: "9:27",
    name: "C",
  },
  {
    day: R,
    start: "9:40",
    end: "11:02",
    name: "B",
  },
  {
    day: R,
    start: "11:05",
    end: "12:27",
    name: "E",
  },
  {
    day: R,
    start: "12:30",
    end: "12:54",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: R,
    start: "12:55",
    end: "13:19",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: R,
    start: "13:22",
    end: "14:44",
    name: "A",
  },
  // Friday
  {
    day: F,
    start: "8:05",
    end: "9:27",
    name: "F",
  },
  {
    day: F,
    start: "9:40",
    end: "11:02",
    name: "E",
  },
  {
    day: F,
    start: "11:05",
    end: "12:27",
    name: "D",
  },
  {
    day: F,
    start: "12:30",
    end: "12:54",
    name: "9/10 L, 11/12 Adv",
  },
  {
    day: F,
    start: "12:55",
    end: "13:19",
    name: "11/12 L, 9/10 Adv",
  },
  {
    day: F,
    start: "13:22",
    end: "14:44",
    name: "Flex Block",
  },
];
