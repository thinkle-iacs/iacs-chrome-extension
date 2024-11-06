<script lang="ts">
  import { onMount } from "svelte";
  import { Fireworks } from "@fireworks-js/svelte";
  import type { FireworksOptions } from "@fireworks-js/svelte";
  let messages = ["Hurrah!", "Yippee!", "Woot!"];
  let canvasResolution = {x : 200, y: 400};
  let animator;
  let animating = true;
  let sync;
  onMount(() => {
    animator = setInterval(() => {
      if (displayPercentage < percentage) {
        let diff = percentage - displayPercentage;
        let delta = Math.ceil(1000 * (diff / 20)) / 1000;
        displayPercentage += delta;
      }
      if (displayPercentage >= percentage) {
        displayPercentage = percentage;
        sync = true;
        clearInterval(animator);
      }
    }, 75);
    doAnimation();
    return () => {
      clearInterval(animator);
      animating = false;
    }
  });
  $: if (sync) {
    displayPercentage = percentage;
  }
  export let percentage;
  let displayPercentage = 0;
  let grainsOfSand = 5000;

  function randomColor() {
    let colorList = [
      "#f9a825", // --material-color-yellow-700
      "#f57f17", // --material-color-yellow-800
      "#f57f17", // --material-color-yellow-900 (appears to be the same as 800 in the example)
      "#ff5722", // --material-color-deep-orange-500 (resolved from the nested variable)
      "#f4511e", // --material-color-deep-orange-600
    ];
    let index = Math.floor(Math.random() * colorList.length);
    return colorList[index];
  }

  function drawGrains () {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvasResolution.x,canvasResolution.y);
    for (let i = 0; i < grains.length; i++) {
      ctx.strokeStyle = 'transparent';
      ctx.fillStyle = grains[i].color;
      ctx.beginPath();
      ctx.arc(grains[i].x * canvasResolution.x, grains[i].y * canvasResolution.y*1, grains[i].size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function makeGrains() {
    let grains = [];
    for (let n = 0; n < grainsOfSand; n++) {
      grains.push({
        id: n,
        x: undefined,
        y: 0,
        size : 1 + Math.random() * canvasResolution.x/50,
        top: true,
        color: `${randomColor()}`,
        speed: Math.random() + 1,
      });
    }
    return grains;
  }
  let lastOnTop = 0;
  let grains = makeGrains(grainsOfSand);
  console.log('Grains=',grains);
  console.log('A grain',grains[10])
  calculateGrainPositions(displayPercentage);
  
  function doAnimation () {
    if (canvas) {
      drawGrains();
      calculateGrainPositions();
    }     
    if (animating) requestAnimationFrame(doAnimation);
  }

  
  function calculateGrainPositions() {
    if (displayPercentage == percentage && percentage > 1) {
      //console.log('Calculate explosion!')
      calculateExplosion(percentage);
      requestAnimationFrame(calculateGrainPositions);
      return;
    }
    //console.log('Calculate grain!')
    let numberOnBottom = Math.floor(grains.length * displayPercentage);
    let numberOnTop = grains.length - numberOnBottom;
    if (numberOnTop != lastOnTop) {
      lastOnTop = numberOnTop;
    }
    for (let i = 0; i < grains.length; i++) {
      if (i < numberOnBottom) {
        // Bottom
        let nthOnBottom = numberOnBottom - (numberOnBottom - i);
        grains[i].y = 0.95 - 0.34 * (nthOnBottom / grainsOfSand);
        if (grains[i].top) {
          grains[i].falling = true;
        }
        grains[i].top = false;
        // Add a shuffling effect
        if (Math.random() < 0.01) { // 10% chance of shuffling
          grains[i].x += (Math.random() - 0.5) * 0.02; // Small horizontal shuffle
          grains[i].x = Math.max(0, Math.min(1, grains[i].x)); // Keep within bounds
        }
      } else {
        // Top...
        let nthOnTop = numberOnTop - (numberOnTop - (i - numberOnBottom));
        grains[i].y = 0.5 - 0.34 * (nthOnTop / grainsOfSand);
        grains[i].top = true;
      }
      if (grains[i].x == undefined || grains[i].falling) {
        grains[i].x = Math.random() * 1;
        grains[i].falling = false;
      }

      let distanceFromCenter = Math.abs(grains[i].y - 0.5);
      if (Math.abs(0.5 - grains[i].x) > distanceFromCenter) {
        grains[i].x = 0.5 + distanceFromCenter * (Math.random() - 0.5);
      }
    }    
  }

  let explosionCounter = -1.3;

  function calculateExplosion(percentage) {
    explosionCounter += 0.05;
    if (explosionCounter < 0) {
      return;
    }
    if (explosionCounter > 10) {
      return;
    }
    for (let i = 0; i < grains.length; i++) {
      let circle = Math.PI * 2;
      let angle = i * (circle / 1000);
      if (!grains[i].xi) {
        grains[i].xi = grains[i].x;
      }
      if (!grains[i].yi) {
        grains[i].yi = grains[i].y;
      }
      grains[i].x =
        grains[i].xi + Math.cos(angle) * explosionCounter * grains[i].speed;
      grains[i].y =
        grains[i].yi +
        Math.sin(angle) * explosionCounter * grains[i].speed +
        explosionCounter * explosionCounter;
      grains[i].falling = true;
    }
  }
  let message = messages[Math.floor(Math.random() * messages.length)];
  let letters = [];
  $: if (explosionCounter > 0) {
    letters = Array(...message.slice(0, explosionCounter));
  }
  let canvas : HTMLCanvasElement;
</script>

<section class="hourglass" class:exploded={explosionCounter > 0}
  on:dblclick={()=>{
    percentage=1;
    console.log('percent=>1');
    displayPercentage = percentage;
    explosionCounter = 0.01;
  }}
  >
  {#if explosionCounter > 0}
    <div class="fire"><Fireworks /></div>
  {/if}
  {#if letters.length}
    <div class="message">
      {#each letters as letter, i}
        {#if letter}
          {letter}
        {:else}
          &nbsp;
        {/if}
      {/each}
    </div>
  {/if}
  <canvas width={canvasResolution.x} height={canvasResolution.y} bind:this={canvas}/>
  <!-- {#each grains as g (g.id)}
    <div
      class="grain"
      style:--x={g.x}
      style:--y={g.y}
      style:--color={g.color}
    />
  {/each} -->
</section>

<style>
  .hourglass.exploded {
    --color: transparent;
  }

  .hourglass::before {
    transition: all 1s;
  }
  .hourglass::after {
    transition: all 1s;
  }
  .hourglass {
    --glass-size: 1;
    --width: 50px;
    --height: 100px;
    --color: var(--material-color-blue-grey-100);
    --triangle-factor: 1.83;
    width: var(--width);
    height: var(--height);
    transition: all 2s;
    position: relative;
  }
  .grain {
    transition: transform 400ms;
    --grainsize: calc(var(--height) / 20);
    box-sizing: border-box;
    width: var(--grainsize);
    height: var(--grainsize);
    transform: translateX(calc(var(--x) * var(--width)))
      translateY(calc(var(--y) * var(--height)));
    height: calc(var(--height) / 100);
    position: absolute;
    z-index: 2;
    top: calc(-0.5 * var(--grainsize));
    left: calc(-0.5 * var(--grainsize));
    border-style: solid;
    border-radius: 50%;
    border-color: var(--color);
    border-width: 2px;
  }
  .hourglass::before {
    content: " ";
    width: 0;
    height: 0;
    border-style: solid;
    border-top-width: calc(
      var(--glass-size) * var(--height) / var(--triangle-factor)
    );
    border-left-width: calc(1.2 * var(--glass-size) * var(--width) / 2);
    border-right-width: calc(1.2 * var(--glass-size) * var(--width) / 2);
    border-bottom: 0;
    border-color: transparent;
    border-top-color: var(--color);

    position: absolute;
    top: 0;
    left: -10%;
    border-top-left-radius: 20%;
    border-top-right-radius: 20%;
  }
  .hourglass::after {
    content: " ";
    width: 0;
    height: 0;
    border-style: solid;
    border-bottom-width: calc(var(--height) / var(--triangle-factor));
    border-left-width: calc(1.2 * var(--width) / 2);
    border-right-width: calc(1.2 * var(--width) / 2);
    border-top: 0;
    border-color: transparent;
    border-bottom-color: var(--color);
    position: absolute;
    bottom: 0;
    left: -10%;
    border-bottom-left-radius: 20%;
    border-bottom-right-radius: 20%;
  }
  .hourglass {
    position: relative;
  }
  .fire {
    pointer-events: none;
    position: absolute;
    top: -200px;
    left: -200px;
    width: calc(var(--width) + 400px);
    height: calc(var(--height) + 400px);
  }
  .message {
    font-family: "Lab DJR Web";
    width: var(--width);
    font-size: 1.6em;
    height: var(--height);
    display: grid;
    place-content: center;
    text-align: center;
    align-items: center;
  }
  canvas {
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
  }
</style>
