<script lang="ts">  
  import { onMount } from "svelte"; 
  
  import Card from "../Card.svelte";
  import { school, prefsSet, showPrefs, whimsy, hideCountdown, preferredCountdownName } from "../prefs";
  import Countdown from "../whimsy/Countdown.svelte";
  
  let showCount = true;
  import {counters,countdownFetcher} from './countdowns';
  import UpdateButton from "../util/UpdateButton.svelte";
  import { now } from "../Schedule/now";
  onMount(async () => {
    await countdownFetcher.update()
  })
  let activeCounters = [];
  let theCounter;

  function filterCounters (countdowns) {
    activeCounters = countdowns.filter(
        (c)=>($now.getTime() - c.target.getTime()) < 60 * 60 * 4         
      )
    theCounter = activeCounters.find((c)=>c.name==$preferredCountdownName)||activeCounters[0];
    
  }

  $: filterCounters($counters);
  /* When the user changes a counter... */
  function updateCounterPref () {
    console.log('Update counter pref!')
    $preferredCountdownName = theCounter.name;
  }
  
  let settingMode = false;
</script>

{#if $whimsy && !$hideCountdown && theCounter}
      <Card bare={true} small={true}>        
        
        <div slot="head" class='top'>
          {#if settingMode}
            Countdown to 
            {#if activeCounters.length > 1}
              <select bind:value={theCounter} on:change={updateCounterPref}>
                {#each activeCounters as counter}
                  <option value={counter}>{counter.name}</option>
                {/each}                
              </select>
              <UpdateButton cds={countdownFetcher}/>
            {:else}
              <h2>
                Countdown to {counters[0].name}
              </h2>
            {/if}
            <button on:click={()=>settingMode=false} 
              style="margin-left: auto; border-radius: 50%; width: 2em; height: 2em; ">
              &times;
            </button>  
          {:else}
            
            <button class="close" on:click={()=>$hideCountdown=true} 
              style="margin-left: auto; border-radius: 50%; width: 2em; height: 2em; ">
              &times;
            </button>  
          {/if}
        </div>        
        <div slot="body" class="main">
          <Countdown 
            target={theCounter.target} 
            countdownStart={theCounter.countdownStart}
            name={theCounter.name}
            >
            <button class="setting" class:active={settingMode} on:click={()=>settingMode=!settingMode}>
              ⚙
            </button>
          </Countdown>
        </div>        
      </Card>      
    {/if}

<style>
  :global(h1, h2, h3, h4, h5, h6) {
    font-weight: var(--bold);
  }
  :root {
    --white: white;
    --black: black;
    --darkgrey: #373737;
    --mediumgrey: #4a4a4a;
    --lightgrey: #aaa;
    --blue: #0033a0;
    --red: #c6093b;
    --darkshadow: #000000e1;
    --tiny: 10px;
    --small: 12px;
    --normal: 16px;
    --big: 24px;
    --huge: 48px;
    --icon-size: 32px;
    --skinny: 200;
    --bold: 500;
    --spacer: 12px;
    --dark-overlay: #000c;
    --light-text: #efefff;
    --cursive: "Tangerine", cursive;
    --pad: 4px;
    --card-width-small: calc(min(200px, 100vw));
    --card-width: calc(min(404px, 100vw));
    --card-width-double: calc(min(808px, 100vw));
    --bar-height: 48px;
    --medium-big-screen: 1100px;
    --smaller-screen: 800px;
    --off-white: #fffef9;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --off-white: #0d0d11;
      --white: black;
      --black: white;
      --darkgrey: #cfcfcf;
      --lightgrey: #515151;
      --mediumgrey: #afafaf;
      --blue: #a4c1ff;
      --red: #f9b4c7;
      --darkshadow: #ffffffd1;
    }
  }

  .overlay {
    position: fixed;
    opacity: 1;
    background-color: var(--darkshadow);
    display: grid;
    place-content: center;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .overlay > :global(button) {
    position: absolute;
    right: var(--spacer);
    top: var(--spacer);
    background-color: var(--white);
  }
  .hidden {
    color: transparent;
  }
  .main {
    position: relative;
  }
  .setting {
    opacity: 0;
    transition: opacity 300ms;
  }
  .main:hover .setting {
    opacity: 1;
  }
  .setting {
    position: absolute;
    top: var(--pad);
    left: var(--pad);
    background-color: var(--white);
    color: var(--black);
    width: 2em;
    height: 2em;
    border-radius: 50%;
    display: grid;
    place-content: center;
  }
  .setting.active {
    background-color: var(--black);
    color: var(--white);
  }
  .top {
    width: 100%; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    flex-wrap: wrap;
  }
  .close {
    opacity: 0;
    transition: opacity 300ms;
  }
  .top:hover .close {
    opacity: 1;
  }
</style>

