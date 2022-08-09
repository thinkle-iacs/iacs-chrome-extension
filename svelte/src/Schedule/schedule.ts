export type ScheduleBlock = {
  day?: number;
  start?: string;
  end?: string;
  name: string;
};

const M = 1;
const T = 2;
const W = 3;
const R = 4;
const F = 5;

let hs_schedule: ScheduleBlock[] = [
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

function parseTime(s) {
  let [h, m] = s.split(":");
  let mnum = Number(m);
  let hnum = Number(h);
  return {
    hour: hnum,
    minutes: mnum,
    minute_offset: hnum * 60 + mnum,
  };
}

export function formatTime(timestring) {
  let parsed = parseTime(timestring);
  let ampm = "am";
  if (parsed.hour >= 12) {
    ampm = "pm";
  }
  if (parsed.hour > 12) {
    parsed.hour -= 12;
  }
  if (parsed.minutes < 10) {
    parsed.minutes = "0" + parsed.minutes;
  }
  return `${parsed.hour}:${parsed.minutes}${ampm}`;
}

export function getHSBlock(date: Date) {
  return getBlock(date, hs_schedule);
}

export function getBlock(date: Date, schedule) {
  let weekday = date.getDay();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let minute_offset = minutes + hour * 60;

  let ret: {
    currentBlock: ScheduleBlock;
    previousBlock: ScheduleBlock;
    nextBlocks: ScheduleBlock[];
  } = {
    currentBlock: null,
    previousBlock: null,
    nextBlocks: [],
  };

  for (let idx = 0; idx < schedule.length; idx++) {
    let block = schedule[idx];
    if (block.day < weekday) {
      continue;
    } else if (block.day == weekday) {
      // TODAY!
      let start = parseTime(block.start);
      let end = parseTime(block.end);
      if (start.minute_offset > minute_offset) {
        // We are before the block...
        if (idx > 0) {
          ret.previousBlock = schedule[idx - 1];
          if (ret.previousBlock.day == block.day) {
            ret.currentBlock = { name: "Passing Time" };
          } else {
            ret.currentBlock = {
              name: "Before School",
            };
          }
        } else {
          ret.currentBlock = {
            name: "Before School",
          };
        }
        ret.nextBlocks = gatherNextBlocks(idx);
        return ret;
      }
      if (
        start.minute_offset < minute_offset &&
        end.minute_offset > minute_offset
      ) {
        // This is the block!!!
        ret.currentBlock = block;
        if (idx > 0) {
          ret.previousBlock = schedule[idx - 1];
        }
        if (idx < schedule.length - 1) {
          ret.nextBlocks = gatherNextBlocks(idx + 1);
        }
        return ret;
      }
    } else if (block.day > weekday) {
      let previousBlock = null;
      if (idx > 0) {
        ret.previousBlock = schedule[idx - 1];
      }
      ret.nextBlocks = gatherNextBlocks(idx);
      ret.currentBlock = { name: "After school" };
      return ret;
    }
  }

  function gatherNextBlocks(idx) {
    if (idx > schedule.length - 1) {
      return [];
    }
    let block = schedule[idx];
    let nextBlocks = [block];
    for (let i = idx + 1; i < schedule.length; i++) {
      let candidateBlock = schedule[i];
      if (candidateBlock.day == block.day) {
        nextBlocks.push(candidateBlock);
      }
    }
    return nextBlocks;
  }
}
