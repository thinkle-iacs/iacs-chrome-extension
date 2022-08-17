<script context="module">
  let pixelConversion = 1.33;
  let colors = [
    "#ffcdd2",
    "#d7ccc8",

    "#ffccbc",
    "#ffe0b2",
    "#e1bee7",
    "#d1c4e9",

    "#f1f8e9",
    "#bbdefb",
    "#b3e5fc",

    "#fff9c4",
    "#e8f5e9",

    "#ffecb3",
  ];
  let colorMap = {
    A: "#f8bbd0",
    B: "#f9fbe7",
    C: "#e0f7fa",
    D: "#c5cae9",
    L: "white",
    Lunch: "white",
    LAdv: "white",
    Advisory: "#e0f2f1",
    WINAdv: "#e0f2f1",
  };
  let colorCount = 0;
  let dayStart = 8 * 60 + 10;
</script>

<script lang="ts">
  export let fullHeight = false;
  import { getOffsetFromTime } from "./schedule";
  export let heightMode = false;
  function getColor(name) {
    if (!name) {
      return "white";
    }
    name = name.replace("40", "");
    name = name.replace("10", "");
    name = name.replace("9/10", "");
    name = name.replace("11/12", "");
    name = name.replace(/\W+/g, "");
    name = name.replace(/[4-9]+/g, "");

    if (colorMap[name]) {
      return colorMap[name];
    } else {
      colorMap[name] = colors[colorCount % colors.length];
      console.log("New color for", name, colorCount, colorMap[name]);
      colorCount += 1;
    }
  }

  export let bold = false;
  export let now: Date | null = null;
  import type { ScheduleBlock } from "./schedule";
  export let block: ScheduleBlock;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  import { formatTime } from "./schedule";
  export let hideDay = false;
  let dayName: string = "";

  function formatForTime(date: Date) {
    let day = date.getDay();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    if (block.day == day) {
      let minuteOffset = hour * 60 + minutes;
      let startOffset = getOffsetFromTime(block.start);
      let endOffset = getOffsetFromTime(block.end);
      if (minuteOffset > startOffset && minuteOffset < endOffset) {
        let totalTime = endOffset - startOffset;
        let elapsedTime = minuteOffset - startOffset;
        let percentage = elapsedTime / totalTime;
        timeMarker = {
          offset: percentage * width,
          percentage,
          minutesLeft: totalTime - elapsedTime,
        };
      } else if (minuteOffset < startOffset) {
        console.log(
          "Countdown...",
          startOffset - minuteOffset,
          "minutes until"
        );
      } else {
        console.log("After by ", startOffset - endOffset);
      }
    } else {
      if (block.day == day + 1) {
        dayName = "Tomorrow";
      } else if (block.day == day - 1) {
        dayName = "Yesterday";
      }
    }
  }

  $: if (now) {
    formatForTime(now);
  }
  let width;
  let timeMarker: {
    offset: number;
    percentage: number;
    minutesLeft: number;
  };

  let height = null;
  let yoffset = null;
  let crammed = false;
  $: {
    if (heightMode) {
      let startOffset = getOffsetFromTime(block.start);
      if (startOffset < dayStart) {
        dayStart = startOffset;
      }
      yoffset = (startOffset - dayStart) * pixelConversion;
      let minutes =
        getOffsetFromTime(block.end) - getOffsetFromTime(block.start);
      height = minutes * pixelConversion;
      if (height < 50) {
        crammed = true;
      } else {
        crammed = false;
      }
    }
  }
</script>

<div
  class:fullHeight
  class:crammed
  class:forceHeight={heightMode}
  bind:clientWidth={width}
  class="block"
  class:bold
  style:background-color={getColor(block.name)}
  style:--foo="hello?"
  style:--height={`${height}px`}
  style:--yoffset={`${yoffset}px`}
>
  {#if timeMarker}
    <div class="arrow" style:left={`${timeMarker.offset}px`} />
    <div class="now">
      {timeMarker.minutesLeft} minute left
      <br />({(timeMarker.percentage * 100).toFixed(0)}%)
    </div>
  {/if}
  <div class="block-title">{block.name}</div>
  <div class="time">
    {#if !hideDay && block.day}<span class="day"
        >{dayName || days[block.day]}</span
      >{/if}
    {#if block.start && block.end}
      <span class="times">
        {formatTime(block.start)}&ndash;{formatTime(block.end)}
      </span>
    {/if}
  </div>
</div>

<style>
  .now {
    position: absolute;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    border-bottom: 5px solid black;
    bottom: 0;
    width: 0;
    font-weight: bold;
    font-size: 1.2em;
    color: transparent;
  }
  .now:hover {
    transition: all 300ms;
    color: var(--darkgrey);
    text-shadow: 1px 1px white;
  }
  .block {
    position: relative;
    color: var(--darkgrey);
    font-weight: var(--thick);
    padding: var(--pad);
    border: 1px solid var(--darkgrey);
  }
  .block.crammed {
    padding: calc(var(--pad) / 2);
  }
  .block-title {
    font-size: 110%;
    text-align: center;
  }
  .crammed * {
    display: inline-block;
    text-align: center;
  }
  .day {
    font-size: 70%;
  }
  .times {
    font-size: 12px;
    white-space: nowrap;
  }
  .bold .times {
    font-size: 14px;
  }

  .bold {
    font-weight: var(--thick);
  }
  .forceHeight {
    min-height: var(--height);
    height: calc(max(var(--height), 100%));
    box-sizing: border-box;
    /*  top: var(--yoffset);
    position: absolute; */
  }
  .forceHeight .times {
    font-size: 16px;
  }
  .crammed {
    font-size: 0.7em;
  }
  .fullHeight {
    height: 100%;
    box-sizing: border-box;
  }
</style>
