import type { ScheduleBlock } from "./types";

import { hs_schedule } from "./hs_schedule";
import { ms_56_a, ms_78_a } from "./ms_schedule";
console.log("MS Sched:", ms_56_a);
export { hs_schedule, ms_56_a, ms_78_a };
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
/* 
export function getHSBlock(date: Date) {
  return getBlock(date, hs_schedule);
} */

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
