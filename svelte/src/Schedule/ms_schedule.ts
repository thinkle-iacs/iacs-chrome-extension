import { M, T, W, R, F } from "./types";
import type { ScheduleBlock } from "./types";

const make_56_middle = (day) => [
  {
    name: "5/6 lunch",
    start: "10:46",
    end: "11:11",
    day,
  },
  {
    name: "5/6 recess",
    start: "11:11",
    end: "11:26",
    day,
  },
  {
    name: "5/6 Adv/WIN",
    start: "11:28",
    end: "12:08",
    day,
  },
];

const make_78_middle = (day) => [
  {
    name: "7/8 WIN/Adv",
    start: "10:46",
    end: "11:26",
    day,
  },
  {
    name: "7/8 Lunch",
    start: "11:28",
    end: "11:53",
    day,
  },
  {
    name: "7/8 Recess",
    start: "11:53",
    end: "12:08",
    day,
  },
];

let wed_56: ScheduleBlock[] = [
  {
    name: "5/6 Enrichment",
    day: W,
    start: "8:10",
    end: "9:20",
  },
  {
    name: "Class 1",
    day: W,
    start: "9:22",
    end: "10:12",
  },
  {
    name: "WIN",
    day: W,
    start: "10:14",
    end: "10:44",
  },
  {
    name: "Lunch",
    day: W,
    start: "10:46",
    end: "11:11",
  },
  {
    name: "Recess",
    day: W,
    start: "11:11",
    end: "11:26",
  },
  {
    name: "Advisory",
    day: W,
    start: "11:28",
    end: "12:08",
  },
  {
    name: "Class 2",
    day: W,
    start: "12:10",
    end: "13:00",
  },
  {
    name: "Class 3",
    day: W,
    start: "13:02",
    end: "13:52",
  },
  {
    name: "Class 4",
    day: W,
    start: "13:54",
    end: "14:45",
  },
];

let wed_78: ScheduleBlock[] = [
  {
    name: "Class 1",
    day: W,
    start: "8:10",
    end: "9:00",
  },
  {
    name: "Class 2",
    day: W,
    start: "9:02",
    end: "9:52",
  },
  {
    name: "Class 3",
    day: W,
    start: "9:54",
    end: "10:44",
  },
  {
    name: "Advisory",
    day: W,
    start: "10:46",
    end: "11:26",
  },
  {
    name: "Lunch",
    day: W,
    start: "11:28",
    end: "11:53",
  },
  {
    name: "Recess",
    day: W,
    start: "11:53",
    end: "12:08",
  },
  {
    name: "WIN",
    day: W,
    start: "12:10",
    end: "12:40",
  },
  {
    name: "Class 4",
    day: W,
    start: "12:42",
    end: "13:32",
  },
  {
    name: "7/8 Enrichment",
    day: W,
    start: "13:34",
    end: "14:45",
  },
];

export const make_ms_a = (middle = make_56_middle, wednesday = wed_56) => {
  // Monday,Tuesday
  const makeMT = (day) => [
    {
      day,
      name: "A",
      start: "8:10",
      end: "9:00",
    },
    {
      day,
      name: "B",
      start: "9:02",
      end: "9:52",
    },
    {
      day,
      name: "C",
      start: "9:54",
      end: "10:44",
    },
    ...middle(day),
    { day, name: "D+P", start: "12:10", end: "13:40" },
    { day, name: "E+ELA", start: "13:43", end: "14:45" },
  ];

  const makeRF = (day) => [
    {
      day,
      name: "D+P",
      start: "8:10",
      end: "9:40",
    },
    {
      day,
      name: "E+ELA",
      start: "9:43",
      end: "10:44",
    },
    ...middle(day),
    {
      day,
      name: "A",
      start: "12:10",
      end: "1:00",
    },
    {
      day,
      name: "B",
      start: "1:02",
      end: "1:52",
    },
    {
      day,
      name: "C",
      start: "1:54",
      end: "2:45",
    },
  ];
  return [...makeMT(M), ...makeMT(T), ...wednesday, ...makeRF(R), ...makeRF(F)];
};

export const ms_56_a = make_ms_a();
export const ms_78_a = make_ms_a(make_78_middle, wed_78);
