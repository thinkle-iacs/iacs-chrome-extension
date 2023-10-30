<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let x = 300; // -500 * Math.random() - 300;
  let y = window.innerHeight * Math.random();
  let targetX;
  let targetY;
  let lastMoved = new Date().getTime();
  let speed = 8;

  let animating = true;
  onDestroy(() => {
    animating = false;
  });

  onMount(() => {
    requestAnimationFrame(animate);
    function animate() {
      let timeSinceLastMove = new Date().getTime() - lastMoved;
      if (timeSinceLastMove > 3000) {
        // If we've been idle for a second, let's crawl off the screen
        targetX = window.innerWidth + 100;
        targetY += Math.random() * 500;
        lastMoved = new Date().getTime();
      }
      if (targetX) {
        if (x < targetX) {
          x += speed;
        } else {
          x -= speed;
        }
      }
      if (targetY) {
        if (y < targetY) {
          y += speed;
        } else {
          y -= speed;
        }
      }
      if (animating) requestAnimationFrame(animate);
    }
  });

  function handleMouseMove(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    lastMoved = new Date().getTime();
  }
  function addToBody(node) {
    document.body.appendChild(node);
    return {
      destroy() {
        document.body.removeChild(node);
      },
    };
  }
</script>

<svelte:window on:mousemove={handleMouseMove} />

<div use:addToBody style="position: fixed; left: {x}px; top: {y}px;">
  <slot />
</div>

<style>
  div {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: var(--material-color-deep-orange);
  }
</style>
