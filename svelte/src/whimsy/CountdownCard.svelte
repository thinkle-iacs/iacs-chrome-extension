<script lang="ts">  
  import { onMount } from "svelte";  
  import Card from "../Card.svelte";
  import { school, prefsSet, showPrefs, whimsy } from "../prefs";
  import Countdown from "../whimsy/Countdown.svelte";
  
  let showCount = true;
  import {counters} from './countdowns';
  let theCounter = counters[0];
  let settingMode = false;
</script>

{#if $whimsy && showCount}
      <Card bare={true} small={true}>        
        
        <div slot="head" class='top'>
          {#if settingMode}
            Countdown to 
            {#if counters.length > 1}
              <select bind:value={theCounter}>
                {#each counters as counter}
                  <option value={counter}>{counter.name}</option>
                {/each}
              </select>
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
            
            <button class="close" on:click={()=>showCount=false} 
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

