<script context="module">
  import { now } from "./now";
  let pixelConversion = 1.5;
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
  export let block: ScheduleBlock;
  export let fullHeight = false;
  export let horizontal = false;
  export let heightMode = false;
  export let bold = false;
  export let hideDay = false;

  import { getOffsetFromTime } from "./schedule";

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

  import type { ScheduleBlock } from "./schedule";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  import { formatTime } from "./schedule";

  let dayName: string = "";

  function formatForTime(date: Date) {
    let day = date.getDay();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    timeMarker = null;
    if (block.day == day) {
      let minuteOffset = hour * 60 + minutes;
      let startOffset = getOffsetFromTime(block.start);
      let endOffset = getOffsetFromTime(block.end);
      if (minuteOffset > startOffset && minuteOffset < endOffset) {
        let totalTime = endOffset - startOffset;
        let elapsedTime = minuteOffset - startOffset;
        let percentage = `${((100 * elapsedTime) / totalTime).toFixed(0)}%`;
        timeMarker = {
          percentage,
          minutesLeft: totalTime - elapsedTime,
        };
      }
    } else {
      if (block.day == day + 1) {
        dayName = "Tomorrow";
      } else if (block.day == day - 1) {
        dayName = "Yesterday";
      }
    }
  }

  $: if (block.start && block.day && block.end) {
    formatForTime($now);
  } else {
    timeMarker = null;
  }

  let timeMarker: {
    percentage: string;
    minutesLeft: number;
  };

  let height = null;
  let yoffset = null;

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
    }
  }
</script>

<div
  class:fullHeight
  class:forceHeight={heightMode}
  class="block"
  class:bold
  style:background-color={getColor(block.name)}
  style:--foo="hello?"
  style:--height={`${height}px`}
  style:--yoffset={`${yoffset}px`}
>
  {#if timeMarker}
    <div
      class="now"
      class:horizontal
      style:--percentage={timeMarker.percentage}
    >
      <div class="arrow" />
      <div class="popup">
        {timeMarker.minutesLeft} minute left
        <br />({timeMarker.percentage})
      </div>
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
    top: 0;
    left: 0;
    width: 100%;
    height: var(--percentage);
    z-index: 2;
    background-color: #01010111;
  }

  .now.horizontal {
    width: var(--percentage);
    height: 100%;
  }

  .arrow {
    position: absolute;
    z-index: 3;
    border-right: 5px solid var(--darkgrey);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    width: 0;
    height: 0;
    bottom: -5px;
    right: 0;
  }

  .horizontal .arrow {
    position: absolute;
    border-bottom: none;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    border-top: 5px solid var(--darkgrey);
    font-weight: bold;
    font-size: 1.2em;
    color: transparent;
    right: -5px;
    bottom: unset;
    top: 0;
  }
  .now .popup {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
    position: absolute;
    right: 0;
    bottom: -5em;
    width: 7em;
    height: 3.5em;
    padding: var(--padding);
    background-color: white;
    border: 1px solid grey;
    border-radius: 5px;
  }
  .now:hover .popup {
    visibility: visible;
    z-index: 2;
    opacity: 1;
    transition: all 300ms;
    color: var(--darkgrey);
    text-shadow: 1px 1px white;
    pointer-events: all;
  }
  .block {
    position: relative;
    color: var(--darkgrey);
    font-weight: var(--thick);
    padding: var(--pad);
    border: 1px solid var(--darkgrey);
  }

  .block-title {
    font-size: 110%;
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

  .fullHeight {
    height: 100%;
    box-sizing: border-box;
  }
</style>
