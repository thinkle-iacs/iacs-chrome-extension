<script lang="ts">
  let mac;
  let platform =
    window.navigator?.userAgentData?.platform || window.navigator.platform;
  if (platform.indexOf("Mac")) {
    mac = true;
  } else {
    mac = false;
  }
</script>

<div class="center" class:mac>
  <slot />
</div>

<style>
  div {
    max-width: 500px;
  }

  :global(.ctrl)::before {
    content: "Ctrl";
    display: inline;
  }
  :global(.sequence) {
    white-space: nowrap;
  }

  :global(.key),
  :global(.ctrl)::before {
    padding: var(--pad);
    display: inline-block;
    border: 1px solid var(--lightgrey);
    margin-left: var(--pad);
    margin-right: calc(var(--pad) / 2);
  }

  .mac :global(.ctrl)::before {
    content: "⌘";
    padding: var(--pad);
    display: inline-block;
    border: 1px solid var(--lightgrey);
  }
  .title {
    font-weight: var(--bold);
    font-size: 120%;
  }
  .fancy {
    font-family: var(--cursive);
  }
</style>
