<script lang="ts">
  export let closeGame;
  import { fade, fly } from "svelte/transition";
  import type { StaffData } from "./types";
  import StaffMember from "./StaffMember.svelte";
  export let staff: StaffData[];
  let allStaff: StaffData[] = [...staff];

  let options: StaffData[] = [];
  let tries = 0;
  let totalTries = 0;
  let totalCorrect = 0;

  let praisewords = [
    "Go you!",
    "Way to go!",
    "Nice one!",
    "Excellent!",
    "Sweet!",
    "Alright!",
    "That's the way!",
    "Color me impressed!",
    "Fantastic!",
    "Fabulous!",
  ];
  let praise = "Yes!";

  $: if (victory) {
    praise = getRandom(praisewords);
  }

  function getRandom(array) {
    let i = Math.floor(Math.random() * array.length);
    return array[i];
  }

  function getRandomStaff() {
    let i = Math.floor(Math.random() * allStaff.length);
    let member = allStaff.splice(i, 1)[0];
    return member;
  }

  let NUMBER = 12;

  let secret: StaffData;
  let all: StaffData[] = [];

  function resetGame() {
    allStaff = [...staff];
    tries = 0;
    victory = false;
    revealed = {};
    showRole = false;
    secret = getRandomStaff();
    options = [];
    while (options.length < NUMBER - 1 && staff.length) {
      options.push(getRandomStaff());
    }
    all = [secret, ...options];
    shuffle(all);
    all = all;
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  $: console.log(revealed);
  let showRole = false;

  let revealed = {};

  function revealMember(sm) {
    tries += 1;
    totalTries += 1;
    console.log("Reveal", sm);
    revealed[sm.id] = true;
    if (sm === secret) {
      victory = true;
      totalCorrect += 1;
    }
  }
  let victory = false;
  resetGame();
  let cols = Math.ceil(Math.sqrt(NUMBER));
  $: cols = Math.ceil(Math.sqrt(NUMBER));
  let lastNumber = NUMBER;
  $: {
    if (lastNumber != NUMBER) {
      resetGame();
      lastNumber = NUMBER;
    }
  }
</script>

{#if victory}
  <div class="victory" in:fly={{ x: -1200, y: -1200 }} out:fade>
    <div>
      <h1>{praise}</h1>
      <b
        >You got it in only {tries} attempt{#if tries > 1}s{/if}!</b
      >
      <StaffMember staffMember={secret} />
      <button on:click={closeGame}>All done for now</button>
      <button on:click={resetGame}>Go me! Play again!</button>
      <div class="score">
        You&rsquo;ve guessed {totalCorrect} in {totalTries}
        {#if totalTries == 1}attempt{:else}attempts{/if}
      </div>
    </div>
  </div>
{/if}
{#if secret}
  <article>
    <button class="close" on:click={closeGame}>&times;</button>
    <div class="top-bar">
      <div class="question">
        Which Staff Member is
        <b
          >{secret.acf.first_name}&nbsp;
          {secret.acf.last_name}</b
        >?
        {#if showRole}<br />
          <span class="hint">(their title is {secret.acf.staff_title}) </span>
        {/if}
      </div>
      {#if secret.acf.staff_title}
        {#if !showRole}
          <button class="hint" on:click={() => (showRole = true)}>
            Hint?
          </button>
        {/if}
      {/if}
      <div class="difficulty">
        Difficulty
        <select bind:value={NUMBER}>
          <option value={4}>Stupid Easy</option>
          <option value={9}>Easy</option>
          <option value={12}>Normal</option>
          <option value={25}>Challenging</option>
          <option value={36}>Fiendish</option>
        </select>
      </div>
      <div class="score">
        {#if totalTries}{totalCorrect}/{totalTries}{/if}
      </div>
    </div>
    <div class="grid" style:--cols={cols}>
      {#each all as sm}
        {#key sm.id}
          <div
            on:click={() => revealMember(sm)}
            class:revealed={revealed[sm.id]}
          >
            <StaffMember
              staffMember={sm}
              showRole={!!revealed[sm.id]}
              showName={!!revealed[sm.id]}
            />
          </div>
        {/key}
      {/each}
    </div>
  </article>
{:else}
  Huh no secret yet?
{/if}

<style>
  .top-bar {
    padding: var(--pad);
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: var(--spacer);
    align-items: center;
    width: 100%;
    background-color: var(--darkgrey);
    color: var(--white);
    height: var(--bar-height);
  }
  .close {
    position: fixed;
    z-index: 99;
    right: calc(3 * var(--pad));
    top: calc(3 * var(--pad));
    width: 3em;
    height: 3em;
    border-radius: 50%;
    display: grid;
    place-content: center;
  }
  .grid div {
    transition: transform 300ms;
  }
  .grid div:hover {
    transform: rotate(-5deg) scale(1.05);
  }
  .revealed {
    transform: rotate(10deg) scale(0.9);
  }
  .grid {
    display: grid;
    justify-content: center;
    grid-template-rows: auto auto auto;
    grid-template-columns: repeat(var(--cols), 180px);
  }
  .victory {
    text-align: center;
    position: fixed;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: grid;
    place-content: center;
    font-size: var(--big);
    background-color: var(--red);
    color: var(--white, "white");
    box-sizing: border-box;
    padding: var(--pad);
    z-index: 100;
  }
  .question {
    font-size: var(--normal);
    position: sticky;
  }
  article {
    text-align: center;
    background-color: var(--dark-overlay);
    color: var(--light-text);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    z-index: 99;
  }
  article :global(a),
  .victory :global(a) {
    color: var(--white);
  }
  button {
    border: 1px solid transparent;
    border-radius: 5px;
    transition: all 300ms;
    background-color: var(--white, "white");
  }
  button:hover {
    box-shadow: 3px 3px var(--dark-overlay);
    background-color: var(--white, "white");
    border: 1px solid var(--black, "black");
  }
  .hint {
    font-size: var(--small);
  }
</style>
