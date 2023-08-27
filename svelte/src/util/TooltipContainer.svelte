<script lang="ts">
  const RIGHT = 1;
  const LEFT = 2;
  const CENTER = 3;
  export let position = RIGHT;
  let tipHidden = true;
  function showTooltip() {
    tipHidden = false;
  }
  function hideTooltip() {
    tipHidden = true;
  }
</script>

<div
  class="container"
  class:right={position == RIGHT}
  class:left={position == LEFT}
  class:center={position == CENTER}
>
  <div 
    style="display:contents"
    on:mouseenter={showTooltip}
    on:mouseleave={hideTooltip}
    >
    <slot name="control"/>
  </div>      
  <div
    class="tooltip"
    class:hide={tipHidden}
    on:mouseenter={showTooltip}
    on:mouseleave={hideTooltip}
  >
    <slot name="tip"/>
  </div>        
</div>

<style>
  
  .container {
    position: relative;
  }
  .tooltip {
    display: grid;
    place-content: center;
    text-align: center;
    height: 3em;
    width: 20em;
    position: absolute;
    top: 2em;
    background-color: var(--darkshadow);
    color: var(--white, "white");
  }
  .right .tooltip {
    right: 0;
  }
  .left .tooltip {
    left: 0;
  }
  .center .tooltip {
    left: 10em;
  }
  .tooltip {
    opacity: 1;
    transition: opacity 300ms;
  }
  .tooltip.hide {
    pointer-events: none;
    opacity: 0;
  }
  
</style>
