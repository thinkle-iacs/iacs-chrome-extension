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
  @media screen and (max-width: 640px) {
    .card-container {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      --max-card-width: calc(100% - var(--pad) * 2);
      width: var(--max-card-width);
    }
  }
</style>
