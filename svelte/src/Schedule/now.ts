import { writable } from "svelte/store";

export let now = writable(new Date());
let intervalId;

function startTime() {
  intervalId = setInterval(() => {
    now.set(new Date());
  }, 1000);
  // Testing code
  /* let realTime = new Date();
  now.set(
    new Date(
      realTime.getFullYear(),
      realTime.getMonth(),
      realTime.getDay(),
      8,
      45,
      30
      //realTime.getHours() + 2,
      //realTime.getMinutes() - 4,
      //realTime.getSeconds()
    )
  ); */
}

function endTime() {
  clearInterval(intervalId);
}

startTime();
