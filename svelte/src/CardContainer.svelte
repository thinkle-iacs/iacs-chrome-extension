<div class="card-container">
  <slot />
</div>

<style>
  .card-container {
    display: grid;
    /* flex-direction: row;
    flex-wrap: wrap; */
    gap: calc(2 * var(--spacer));
    grid-template-columns: repeat(auto-fit, var(--card-width-small));
    align-items: start;
    justify-content: center;
  }
</style>
