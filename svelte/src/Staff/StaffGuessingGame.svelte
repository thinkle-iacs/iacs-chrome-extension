<script lang="typescript">
  import { fade, fly } from "svelte/transition";
  import type { StaffData } from "./types";
  import StaffMember from "./StaffMember.svelte";
  export let staff: StaffData[];
  let allStaff: StaffData[] = [...staff];

  let options: StaffData[] = [];
  let tries = 0;
  function getRandomStaff() {
    let i = Math.floor(Math.random() * allStaff.length);
    let member = allStaff.splice(i, 1)[0];
    return member;
  }

  let NUMBER = 9;

  let secret: StaffData;
  let all: StaffData[] = [];

  function resetGame() {
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

  let showRole = false;

  let revealed = {};

  function revealMember(sm) {
    tries += 1;
    console.log("Reveal", sm);
    revealed[sm.acf.email_address] = true;
    if (sm === secret) {
      victory = true;
    }
  }
  let victory = false;
  resetGame();
</script>

{#if victory}
  <div class="victory" in:fly={{ x: -1200, y: -1200 }} out:fade>
    <div>
      <b
        >You got it in only {tries} attempt{#if tries > 1}s{/if}!</b
      >
      <StaffMember staffMember={secret} />
      <button on:click={resetGame}>Go me!</button>
    </div>
  </div>
{/if}
{#if secret}
  <div class="question">
    Which Staff Member is
    <b
      >{secret.acf.first_name}&nbsp;
      {secret.acf.last_name}</b
    >?
    {#if secret.acf.staff_title}
      {#if !showRole}<button on:click={() => (showRole = true)}
          >Need a Hint?</button
        >{/if}
      {#if showRole}(their title is {secret.acf.staff_title}){/if}
    {/if}
    <div class="grid">
      {#each all as sm}
        {#key sm.acf.email_address}
          <div
            on:click={() => revealMember(sm)}
            class:revealed={!!revealed[sm.acf.email_address]}
          >
            <StaffMember
              staffMember={sm}
              showRole={!!revealed[sm.acf.email_address]}
              showName={!!revealed[sm.acf.email_address]}
            />
          </div>
        {/key}
      {/each}
    </div>
  </div>
{:else}
  Huh no secret yet?
{/if}

<style>
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
    grid-template-columns: 220px 220px 220px;
  }
  .victory {
    position: fixed;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: grid;
    place-content: center;
    font-size: 200%;
    background-color: var(--red);
    color: white;
  }
  .question {
    font-size: 125%;
  }
</style>
