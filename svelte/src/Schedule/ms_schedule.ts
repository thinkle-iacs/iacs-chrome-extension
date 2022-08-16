import { M, T, W, R, F } from "./types";
import type { ScheduleBlock } from "./types";

const make_56_middle = (day) => [
  {
    name: "Lunch",
    start: "10:46",
    end: "11:11",
    day,
  },
  {
    start: "11:11",
    end: "11:26",
    day,
  },
  {
    name: "WIN/Adv",
    start: "11:28",
    end: "12:08",
    day,
  },
];

const make_78_middle = (day) => [
  {
    name: "WIN/Adv",
    start: "10:46",
    end: "11:26",
    day,
  },
  {
    name: "Lunch",
    start: "11:28",
    end: "11:53",
    day,
  },
  {
    name: "Recess",
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
    { day, name: "E+10", start: "13:43", end: "14:45" },
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
      name: "E+10",
      start: "9:43",
      end: "10:44",
    },
    ...middle(day),
    {
      day,
      name: "A",
      start: "12:10",
      end: "13:00",
    },
    {
      day,
      name: "B",
      start: "13:02",
      end: "13:52",
    },
    {
      day,
      name: "C",
      start: "13:54",
      end: "2:45",
    },
  ];
  return [...makeMT(M), ...makeMT(T), ...wednesday, ...makeRF(R), ...makeRF(F)];
};

export const make_ms_transitions = (
  middle = make_56_middle,
  wednesday = wed_56
) => {
  const makeDay = (day) => {
    let blocks;
    if (day == M || day == T) {
      blocks = "ABCDEF";
    } else {
      blocks = "DEFABC";
    }
    return [
      {
        day,
        name: blocks[0],
        start: "8:10",
        end: "9:00",
      },
      {
        day,
        name: blocks[1] + "+10",
        start: "9:00",
        end: "9:10",
      },
      {
        day,
        name: blocks[1] + "+40",
        start: "9:13",
        end: "9:40",
      },
      {
        day,
        name: blocks[1] + "+10",
        start: "9:43",
        end: "9:52",
      },
      {
        day,
        name: blocks[2],
        start: "9:54",
        end: "10:44",
      },
      ...middle(day),
      {
        day,
        name: blocks[3],
        start: "12:10",
        end: "13:00",
      },
      {
        day,
        name: blocks[4] + "+10",
        start: "13:02",
        end: "13:10",
      },
      {
        day,
        name: blocks[4] + "+40",
        start: "13:13",
        end: "13:40",
      },
      {
        day,
        name: blocks[4] + "+10",
        start: "13:43",
        end: "13:52",
      },
      {
        day,
        name: blocks[5],
        start: "13:54",
        end: "14:45",
      },
    ];
  };
  return [
    ...makeDay(M),
    ...makeDay(T),
    ...wednesday,
    ...makeDay(R),
    ...makeDay(F),
  ];
};

export const make_ms_simple = (middle = make_56_middle, wednesday = wed_56) => {
  const makeDay = (day) => {
    let blocks;
    if (day == M || day == T) {
      blocks = "ABCDEF";
    } else {
      blocks = "DEFABC";
    }
    return [
      {
        day,
        name: blocks[0],
        start: "8:10",
        end: "9:00",
      },
      {
        day,
        name: blocks[1],
        start: "9:02",
        end: "9:52",
      },
      {
        day,
        name: blocks[2],
        start: "9:54",
        end: "10:44",
      },
      ...middle(day),
      {
        day,
        name: blocks[3],
        start: "12:10",
        end: "13:00",
      },
      {
        day,
        name: blocks[4],
        start: "13:02",
        end: "13:52",
      },
      {
        day,
        name: blocks[5],
        start: "13:54",
        end: "14:45",
      },
    ];
  };
  return [
    ...makeDay(M),
    ...makeDay(T),
    ...wednesday,
    ...makeDay(R),
    ...makeDay(F),
  ];
};

export const make_ms_ela = (middle = make_56_middle, wednesday = wed_56) => {
  // Monday,Tuesday
  const makeDay = (day) => {
    let blocks;
    if (day == M || day == T) {
      blocks = "ACDF";
    } else {
      blocks = "DFAC";
    }
    return [
      {
        day,
        name: blocks[0] + "+10",
        start: "8:10",
        end: "9:10",
      },
      {
        day,
        name: blocks[1] + "+10",
        start: "9:43",
        end: "10:44",
      },
      ...middle(day),
      { day, name: blocks[2] + "+10", start: "12:10", end: "13:10" },
      { day, name: blocks[3] + "+10", start: "13:43", end: "14:45" },
    ];
  };
  return [
    ...makeDay(M),
    ...makeDay(T),
    ...wednesday,
    ...makeDay(R),
    ...makeDay(F),
  ];
};

export const ms_56_a = make_ms_a();
export const ms_78_a = make_ms_a(make_78_middle, wed_78);
export const ms_56_ela = make_ms_ela(make_56_middle, wed_56);
export const ms_78_ela = make_ms_ela(make_78_middle, wed_78);
export const ms_56_simple = make_ms_simple(make_56_middle, wed_56);
export const ms_78_simple = make_ms_simple(make_78_middle, wed_78);
export const ms_56_trans = make_ms_transitions(make_56_middle, wed_56);
export const ms_78_trans = make_ms_transitions(make_78_middle, wed_78);
