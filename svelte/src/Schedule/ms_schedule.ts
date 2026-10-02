import { M, T, W, R, F } from "./types";
import type { ScheduleBlock } from "./types";

type Day = ScheduleBlock["day"];

// 2026-2027 MS Bell Schedule.
// Grades 5-8 share the same Advisory/period times on Mon, Tue, Thu, Fri,
// but each grade has its own WIN/Lunch/Recess block, and Wednesday has an
// entirely different (grade-specific) schedule.

type Grade = 5 | 6 | 7 | 8;

// The 11:03-11:40 and 11:41-12:18 WIN/Lunch/Recess blocks, by grade.
const make_middle = (grade: Grade, day: Day): ScheduleBlock[] => {
  switch (grade) {
    case 5:
      return [
        { name: "Lunch", start: "11:03", end: "11:23", day },
        { name: "Recess", start: "11:23", end: "11:40", day },
        { name: "WIN", start: "11:41", end: "12:18", day },
      ];
    case 6:
      return [
        { name: "Recess", start: "11:03", end: "11:20", day },
        { name: "Lunch", start: "11:20", end: "11:40", day },
        { name: "WIN", start: "11:41", end: "12:18", day },
      ];
    case 7:
      return [
        { name: "WIN", start: "11:03", end: "11:40", day },
        { name: "Lunch", start: "11:41", end: "12:01", day },
        { name: "Recess", start: "12:01", end: "12:18", day },
      ];
    case 8:
      return [
        { name: "WIN", start: "11:03", end: "11:40", day },
        { name: "Recess", start: "11:41", end: "11:58", day },
        { name: "Lunch", start: "11:58", end: "12:18", day },
      ];
  }
};

// The Wednesday schedule, by grade.
const make_wednesday = (grade: Grade): ScheduleBlock[] => {
  switch (grade) {
    case 5:
      return [
        { name: "Block 1", day: W, start: "8:05", end: "8:53" },
        { name: "Block 2", day: W, start: "8:55", end: "9:43" },
        { name: "Brunch", day: W, start: "9:45", end: "10:05" },
        { name: "Block 3", day: W, start: "10:05", end: "10:52" },
        { name: "Block 4 (Enrichment)", day: W, start: "10:53", end: "11:58" },
        { name: "Block 5", day: W, start: "12:02", end: "12:45" },
      ];
    case 6:
      return [
        { name: "Block 1", day: W, start: "8:05", end: "8:53" },
        { name: "Block 2", day: W, start: "8:55", end: "9:43" },
        { name: "Block 3", day: W, start: "9:45", end: "10:32" },
        { name: "Brunch", day: W, start: "10:32", end: "10:52" },
        { name: "Block 4 (Enrichment)", day: W, start: "10:53", end: "11:58" },
        { name: "Block 5", day: W, start: "12:02", end: "12:45" },
      ];
    case 7:
      return [
        { name: "Block 1 (Enrichment)", day: W, start: "8:05", end: "9:10" },
        { name: "Block 2", day: W, start: "9:12", end: "10:00" },
        { name: "Block 3", day: W, start: "10:02", end: "10:51" },
        { name: "Brunch", day: W, start: "10:53", end: "11:13" },
        { name: "Block 4", day: W, start: "11:13", end: "12:00" },
        { name: "Block 5", day: W, start: "12:02", end: "12:45" },
      ];
    case 8:
      return [
        { name: "Block 1 (Enrichment)", day: W, start: "8:05", end: "9:10" },
        { name: "Block 2", day: W, start: "9:12", end: "10:00" },
        { name: "Block 3", day: W, start: "10:02", end: "10:51" },
        { name: "Block 4", day: W, start: "10:53", end: "11:40" },
        { name: "Brunch", day: W, start: "11:40", end: "12:00" },
        { name: "Block 5", day: W, start: "12:02", end: "12:45" },
      ];
  }
};

export const make_ms_grade_schedule = (grade: Grade): ScheduleBlock[] => {
  const makeDay = (day: Day): ScheduleBlock[] => {
    let blocks;
    if (day == M || day == T) {
      blocks = "ABCDEF";
    } else {
      blocks = "DEFABC";
    }
    return [
      { day, name: "Advisory", start: "8:05", end: "8:35" },
      { day, name: blocks[0], start: "8:36", end: "9:24" },
      { day, name: blocks[1], start: "9:25", end: "10:13" },
      { day, name: blocks[2], start: "10:14", end: "11:02" },
      ...make_middle(grade, day),
      { day, name: blocks[3], start: "12:19", end: "13:07" },
      { day, name: blocks[4], start: "13:08", end: "13:56" },
      { day, name: blocks[5], start: "13:57", end: "14:45" },
    ];
  };
  return [
    ...makeDay(M),
    ...makeDay(T),
    ...make_wednesday(grade),
    ...makeDay(R),
    ...makeDay(F),
  ];
};

export const ms_5th = make_ms_grade_schedule(5);
export const ms_6th = make_ms_grade_schedule(6);
export const ms_7th = make_ms_grade_schedule(7);
export const ms_8th = make_ms_grade_schedule(8);
