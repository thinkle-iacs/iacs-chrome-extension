import { CachedDataStore } from "../util/dataFetcher";
import { GASURL } from "../shimURL";
import { derived, writable } from "svelte/store";
const days = ['Su','M','T','W','R','F','Sat'];

type DayTime = {
  day : 'Su'|'M'|'T'|'W'|'R'|'F'|'Sat'|'Every';
  hour : number;
  minute : number;
}

type RepeatCountdown = Countdown | {
  repeatStart? : DayTime;
  repeatEnd? : DayTime;
  name : string;
}

type CountdownData = {
  name : string;
  target : Date|string;
  countdownStart : Date|string;
}

type Countdown = {
  name : string;
  target : Date;
  countdownStart : Date;
}

export let countdownData: (RepeatCountdown | CountdownData)[] = [
  // Semester 1 items
  {
    name: "End of Semester 1",
    target: "2025-01-16T14:45:00",
    countdownStart: "2024-08-27T08:05:00",
  },
  {
    name: "Winter Break",
    target: "2024-12-23T14:45:00",
    countdownStart: "2024-08-27T08:05:00",
  },
  {
    name: "Fall Break",
    target: "2024-11-28T14:45:00",
    countdownStart: "2024-08-27T08:05:00",
  },
  {
    countdownStart: "2024-08-27T08:05:00",
    target: "2024-10-11T14:45:00",
    name: "Indigenous People's Day Weekend",
  },
  {
    countdownStart: "2024-10-15T08:05:00",
    target: "2024-11-08T14:45:00",
    name: "Veteran's Day Weekend",
  },
  {
    countdownStart: "2024-08-27T08:05:00",
    target: "2025-06-11T14:45:00",
    name: "End of School Year",
  },
  // Semester 2 items
  {
    countdownStart: "2025-01-21T08:05:00",
    target: "2025-06-11T14:45:00",
    name: "End of Semester 2",
  },
  {
    countdownStart: "2025-01-21T08:05:00",
    target: "2025-02-14T14:45:00",
    name: "February Break",
  },
  {
    countdownStart: "2025-01-21T08:05:00",
    target: "2025-04-18T14:45:00",
    name: "April Break",
  },
  {
    countdownStart: "2025-04-28T08:05:00",
    target: "2025-05-23T14:45:00",
    name: "Memorial Day Weekend",
  },
  // Repeating counters...
  {
    name: "The Weekend",
    repeatStart: {
      day: "M",
      hour: 8,
      minute: 5,
    },
    repeatEnd: {
      day: "F",
      hour: 14,
      minute: 45,
    },
  },
  {
    name: "The Day",
    repeatStart: {
      day: "Every",
      hour: 8,
      minute: 5,
    },
    repeatEnd: {
      day: "Every",
      hour: 14,
      minute: 45,
    },
  },

  {
    name: "Summer Vacation",
    target: new Date(2024, 5, 17, 12, 45),
    countdownStart: new Date(2023, 7, 29, 8, 5),
  },
];



function getCounter (c : RepeatCountdown|CountdownData) : Countdown {
  if ('target' in c) {
    /* Just cast strings into dates if we're a straightforward
    CountdownData object */
    let countdownStart,target;
    if (typeof c.countdownStart =='string') {
      countdownStart = new Date(c.countdownStart);
    } else {
      countdownStart = c.countdownStart
    }
    if (typeof c.target == 'string') {
      target = new Date(c.target);
    } else {
      target = c.target;
    }
    return {
      ...c,
      target,countdownStart
    }
  } else {
    /* Otherwise, we're Day-of-Week based: get the dates
    from the day-of-week info */
    const now = new Date();
    const currentDay = now.getDay();
    let startDay = days.indexOf(c.repeatStart.day);
    if (c.repeatStart.day == 'Every') {
      startDay = currentDay;
    }
    let endDay = days.indexOf(c.repeatEnd.day);
    if (c.repeatEnd.day == 'Every') {
      endDay = currentDay;
    }
    // i.e. it's Wednesday and we start Monday, so 3 - 1 = 2
    const startDiff = currentDay - startDay;
    // i.e. it's Wednesday and we end Friday, so 6 - 3 = 3
    const endDiff = endDay - currentDay;
    const startDateNum = now.getDate() - startDiff;
    const endDateNum = now.getDate() + endDiff;
    return {
      name : c.name,
      target : new Date(
        now.getFullYear(),
        now.getMonth(),
        endDateNum,
        c.repeatEnd.hour,
        c.repeatEnd.minute
      ),
      countdownStart : new Date(
        now.getFullYear(),
        now.getMonth(),
        startDateNum,
        c.repeatStart.hour,
        c.repeatStart.minute
      )
    }
  }
}
$: console.log(countdownData);

export const counters = writable(countdownData.map(getCounter));

export const countdownFetcher = new CachedDataStore({
  url: `${GASURL}&countdowns=true`,
  name: "counters",
  expiresAfter: 60 * 60 * 4, // four hours
  defaultValue: countdownData,
});

