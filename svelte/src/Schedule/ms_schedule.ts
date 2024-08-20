import { M, T, W, R, F } from "./types";
import type { ScheduleBlock } from "./types";

const make_56_middle = (day) => {
  if (day == W) {
    return [
      {
        name: "5th Lunch",
        start: "10:32",
        end: "10:47",
        day,
      },
      {
        name: "6th Lunch",
        start: "10:47",
        end: "11:03",
        day,
      },
    ];
  } else {
    return [
      {
        name: "5th Lunch",
        start: "11:03",
        end: "11:23",
        day,
      },
      {
        name: "6th Lunch",
        start: "11:23",
        end: "11:38",
        day,
      },
      {
        name: "WIN",
        start: "11:40",
        end: "12:12",
        day,
      },
    ];
  }
};

const make_78_middle = (day) => {
  if (day == W) {
    return [
      {
        name: "7th Lunch",
        start: "11:21",
        end: "11:36",
        day,
      },
      {
        name: "8th Lunch",
        start: "11:36",
        end: "11:51",
        day,
      },
    ];
  } else {
    return [
      {
        name: "WIN",
        start: "11:10",
        end: "11:42",
        day,
      },
      {
        name: "7th Lunch",
        start: "11:42",
        end: "11:53",
        day,
      },
      {
        name: "8th Lunch",
        start: "11:53",
        end: "12:08",
        day,
      },
    ];
  }
};

let wed_56: ScheduleBlock[] = [
  {
    name: "Wed A",
    day: W,
    start: "8:05",
    end: "8:52",
  },
  {
    name: "Wed B",
    day: W,
    start: "8:54",
    end: "9:41",
  },
  {
    name: "Wed C",
    day: W,
    start: "9:43",
    end: "10:30",
  },
  ...make_56_middle(W),
  {
    name: "Wed D",
    day: W,
    start: "11:04",
    end: "11:51",
  },
  {
    name: "Wed E",
    day: W,
    start: "11:53",
    end: "12:40",
  },
];

let wed_78: ScheduleBlock[] = [
  {
    name: "Class 1",
    day: W,
    start: "8:05",
    end: "8:52",
  },
  {
    name: "Class 2",
    day: W,
    start: "8:54",
    end: "9:41",
  },
  {
    name: "Class 3",
    day: W,
    start: "9:43",
    end: "10:30",
  },
  {
    name: "Class 4",
    day: W,
    start: "10:32",
    end: "11:19",
  },
  ...make_78_middle(W),
  {
    name: "Class 5",
    day: W,
    start: "11:53",
    end: "12:40",
  },
];

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
        name: "Advisory",
        day,
        start: "8:05",
        end: "8:35",
      },
      {
        day,
        name: blocks[0],
        start: "8:36",
        end: "9:24",
      },
      {
        day,
        name: blocks[1] + "+10",
        start: "9:25",
        end: "9:34",
      },
      {
        day,
        name: blocks[1] + "+40",
        start: "9:35",
        end: "10:03",
      },
      {
        day,
        name: blocks[1] + "+10",
        start: "10:04",
        end: "10:13",
      },
      {
        day,
        name: blocks[2],
        start: "10:14",
        end: "11:02",
      },
      ...middle(day),
      {
        day,
        name: blocks[3],
        start: "12:19",
        end: "13:07",
      },
      {
        day,
        name: blocks[4] + "+ELA¹",
        start: "13:08",
        end: "13:17",
      },
      {
        day,
        name: blocks[4] + "+Proj",
        start: "13:18",
        end: "13:46",
      },
      {
        day,
        name: blocks[4] + "+ELA²",
        start: "13:47",
        end: "13:56",
      },
      {
        day,
        name: blocks[5],
        start: "13:56",
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
        name: "Advisory",
        start: "8:05",
        end: "8:35",
      },
      {
        day,
        name: blocks[0],
        start: "8:36",
        end: "9:24",
      },
      {
        day,
        name: blocks[1],
        start: "9:25",
        end: "10:13",
      },
      {
        day,
        name: blocks[2],
        start: "10:14",
        end: "11:02",
      },
      ...middle(day),
      {
        day,
        name: blocks[3],
        start: "12:19",
        end: "13:07",
      },
      {
        day,
        name: blocks[4],
        start: "13:08",
        end: "13:56",
      },
      {
        day,
        name: blocks[5],
        start: "13:56",
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
        name: "Advisory",
        start: "8:05",
        end: "8:35",
      },
      {
        day,
        name: blocks[0] + "+ELA",
        start: "8:36",
        end: "9:37",
      },
      {
        day,
        name: blocks[1] + "+ELA",
        start: "10:04",
        end: "11:02",
      },
      ...middle(day),
      { day, name: blocks[2] + "+ELA", start: "12:19", end: "13:17" },
      { day, name: blocks[3] + "+ELA", start: "13:45", end: "14:45" },
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

export const ms_56_ela = make_ms_ela(make_56_middle, wed_56);
export const ms_78_ela = make_ms_ela(make_78_middle, wed_78);
export const ms_56_simple = make_ms_simple(make_56_middle, wed_56);
export const ms_78_simple = make_ms_simple(make_78_middle, wed_78);
export const ms_56_trans = make_ms_transitions(make_56_middle, wed_56);
export const ms_78_trans = make_ms_transitions(make_78_middle, wed_78);
