import { writable } from "svelte/store";

export let now = writable(new Date());
let intervalId;

function startTime() {
  intervalId = setInterval(() => {
    // Testing code
    /* let realTime = new Date();
    now.set(
      new Date(
        realTime.getFullYear(),
        realTime.getMonth(),
        realTime.getDay(),
        realTime.getHours() + 2,
        realTime.getMinutes() - 4,
        realTime.getSeconds()
      )
    ); */
    now.set(new Date());
  }, 1000);
}

function endTime() {
  clearInterval(intervalId);
}

startTime();
