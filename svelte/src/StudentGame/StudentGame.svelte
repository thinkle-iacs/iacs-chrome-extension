<script lang="ts">
  import Card from "../Card.svelte";
  import StaffGuessingGame from "../Staff/StaffGuessingGame.svelte";
  import type { StudentData } from "types";
  import { students } from "../prefs";
  import KeyContent from "../KeyContent.svelte";

  async function getListFromClipboard() {
    let items = await navigator.clipboard.read();
    for (const i of items) {
      if (i.types.indexOf("text/html") > -1) {
        console.log("Yippee! html", i.types);
        let blob = await i.getType("text/html");
        let text = await blob.text();
        getListFromHTML(text);
      }
    }
  }
  function getListFromHTML(text) {
    hidden.innerHTML = text; // real dangerous buddy...
    let trCollection = hidden.querySelectorAll("tr");
    console.log("Got me some rows", trCollection);
    for (let row of trCollection) {
      /* Ugly hard-coded stuff based on our field set -- ewwwwww */
      let first = row.querySelector("td:nth-child(1)")?.textContent;
      let last = row.querySelector("td:nth-child(2)")?.textContent;
      let img = row.querySelector("td:nth-child(3) img");
      let url = img?.src;
      let bday = row.querySelector("td:nth-child(4)")?.textContent;
      let pronouns = row.querySelector("td:nth-child(5)")?.textContent;
      let phonetic = row.querySelector("td:nth-child(6)")?.textContent;
      if (url) {
        $students = [
          ...$students,
          {
            id: first + last,
            first,
            last,
            image: url,
            bday,
            phonetic,
            pronouns,
          },
        ];
      }
    }
  }
  let hidden;
  let play = false;
  let reallyDelete = false;
  let showInstructions = false;
</script>

<Card id="Student Game">
  <h2 slot="head">Student Guessing Game</h2>
  <div slot="body">
    {#if $students.length}
      <div>We have {$students.length} students loaded!</div>
      <button class="button" on:click={() => (play = true)}
        >Play Guess-that-Student</button
      >
    {:else}
      You need to import students from Aspen to play (you'll just have to do
      this once)
      {#if !showInstructions}
        <div>
          <button on:click={() => (showInstructions = true)}>
            Show me how!
          </button>
        </div>
      {/if}
    {/if}
    {#if showInstructions && !$students.length}
      <KeyContent>
        <div class="instructions">
          <ul>
            <li>
              Open <a
                target="_BLANK"
                href="https://ma-innovation.myfollett.com/aspen/staffStudentList.do"
                >Aspen to the student view</a
              >
            </li>
            <li>
              Select the Name+Photo fieldset (click on the grid, next to the
              filter icon)
            </li>
            <li>Click on the Printer icon and select "HTML"</li>
            <li>
              In the window that pops up, select all (<span class="sequence"
                ><span class="ctrl" /><span class="key">a</span></span
              >) and then copy the text with
              <span class="sequence"
                ><span class="ctrl" /><span class="key">c</span></span
              >
            </li>
            <li>
              Come back to this window and click <button
                on:click={getListFromClipboard}>📋 Paste students</button
              >
            </li>
          </ul>
          Then
        </div>
      </KeyContent>
    {/if}

    {#if play}
      <StaffGuessingGame closeGame={() => (play = false)} staff={$students} />
    {/if}
  </div>
  <div
    style="display:flex;flex-direction:row;justify-content:end; gap: var(--pad);"
    slot="footer"
  >
    <button on:click={getListFromClipboard}>📋 Paste students</button>
    {#if $students.length}
      {#if reallyDelete}
        Are you sure?
        <button on:click={() => (reallyDelete = false)}>Oops, nevermind</button>
        <button on:click={() => ($students = [])}
          >No, really - clear my student list</button
        >
      {:else}
        <button on:click={() => (reallyDelete = true)}> Clear students </button>
      {/if}
    {/if}
  </div>
</Card>
<div bind:this={hidden} style="display:none" />

<style>
  .button {
    border: 1px solid transparent;
    border-radius: 15px;
    transition: all 300ms;
    background-color: var(--blue);
    color: var(--white, "white");
    font-weight: var(--bold);
    padding: calc(3 * var(--pad));
  }
  .button:hover {
    border: 1px solid var(--red);
  }
</style>
