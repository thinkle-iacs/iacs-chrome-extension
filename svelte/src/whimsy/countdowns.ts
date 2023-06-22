const days = ['Su','M','T','W','R','F','Sat'];

type DayTime = {
  day : 'Su'|'M'|'T'|'W'|'R'|'F'|'Sat';
  hour : number;
  minute : number;
}

type Countdown = Counter | {
  repeatStart? : DayTime;
  repeatEnd? : DayTime;
  name : string;
}

type Counter = {
  name : string;
  target : Date;
  countdownStart : Date;
}


export let counterData: Countdown[] = [
  {
    name: "First Day of School",
    countdownStart: new Date(2023, 5, 20, 12, 25),
    target: new Date(2023, 7, 29, 8, 5),
  },
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
    name: "Half Day Wednesday",
    repeatStart: {
      day: "M",
      hour: 8,
      minute: 5,
    },
    repeatEnd: {
      day: "W",
      hour: 12,
      minute: 45,
    },
  },
  {
    name: "Summer Vacation",
    target: new Date(2023, 5, 20, 12, 25),
    countdownStart: new Date(2022, 7, 30, 8, 10),
  },
];



function getCounter (c : Countdown) : Counter {
  if ('target' in c) {
    return c;
  } else {
    const now = new Date();
    const currentDay = now.getDay();
    const startDay = days.indexOf(c.repeatStart.day);
    const endDay = days.indexOf(c.repeatEnd.day);
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

export let counters = counterData.map(getCounter);