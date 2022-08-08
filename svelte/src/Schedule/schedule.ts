export type ScheduleBlock = {
  day: number;
  start: string;
  end: string;
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
    name: "9/10 Lunch, 11/12 Advisory",
  },
  {
    day: M,
    start: "12:58",
    end: "13:22",
    name: "11/12 Lunch, 9/10 Advisory",
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
    name: "9/10 Lunch, 11/12 Advisory",
  },
  {
    day: T,
    start: "12:58",
    end: "13:22",
    name: "11/12 Lunch, 9/10 Advisory",
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
    name: "9/10 Lunch, 11/12 Advisory",
  },
  {
    day: W,
    start: "12:58",
    end: "13:22",
    name: "11/12 Lunch, 9/10 Advisory",
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
    name: "9/10 Lunch, 11/12 Advisory",
  },
  {
    day: R,
    start: "12:58",
    end: "13:22",
    name: "11/12 Lunch, 9/10 Advisory",
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
    name: "9/10 Lunch, 11/12 Advisory",
  },
  {
    day: F,
    start: "12:58",
    end: "13:22",
    name: "11/12 Lunch, 9/10 Advisory",
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
  let weekday = date.getDay();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let minute_offset = minutes + hour * 60;
  for (let idx = 0; idx < hs_schedule.length; idx++) {
    let block = hs_schedule[idx];
    if (block.day < weekday) {
      continue;
    } else if (block.day == weekday) {
      // TODAY!
      let start = parseTime(block.start);
      let end = parseTime(block.end);
      if (
        start.minute_offset < minute_offset &&
        end.minute_offset > minute_offset
      ) {
        // This is the block!!!
        let currentBlock = block;
        let previousBlock = null;
        let nextBlock = null;
        if (idx > 0) {
          previousBlock = hs_schedule[idx - 1];
        }
        if (idx < hs_schedule.length - 1) {
          nextBlock = hs_schedule[idx + 1];
        }
        return {
          currentBlock,
          nextBlock,
          previousBlock,
        };
      }
    } else if (block.day > weekday) {
      let previousBlock = null;
      if (idx > 0) {
        previousBlock = hs_schedule[idx - 1];
      }
      let nextBlocks = [block];
      for (let i = idx + 1; i < hs_schedule.length; i++) {
        let candidateBlock = hs_schedule[i];
        if (candidateBlock.day == block.day) {
          nextBlocks.push(candidateBlock);
        }
      }
      return {
        nextBlocks,
        previousBlock,
        currentBlock: null,
      };
    }
  }
}
