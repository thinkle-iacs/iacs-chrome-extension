<script>
  export let double = false;
  export let small = false;
</script>

<div class="card" class:double class:small>
  <div class="head">
    <slot name="head" />
  </div>
  <div class="body">
    <slot name="body" />
  </div>
  <div class="footer">
    <slot name="footer" />
  </div>
</div>

<style>
  .card {
    width: var(--card-width);
    display: flex;
    flex-direction: column;
    /* max-width: calc(min(800px, 45vw));
    min-width: calc(max(250px, 30vw)); */
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    padding: var(--pad);
    margin: var(--pad);
  }
  .card.double {
    width: var(--card-width-double);
  }
  .card.small {
    width: var(--card-width-small);
  }
  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
  .head,
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .head,
  .footer,
  .body {
    padding: calc(2 * var(--pad, 4px));
    box-sizing: border-box;
  }
  .head {
    border-bottom: 1px solid var(--lightgrey);
    height: var(--bar-height);
  }
  .footer {
    border-top: 1px solid var(--lightgrey);
    height: var(--bar-height);
  }
</style>
