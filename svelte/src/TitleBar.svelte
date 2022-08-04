<script lang="ts">
  import Menu from "./Menu.svelte";
</script>

<div>
  <img src="./icons/IACS_logo.png" />
  <h1>Welcome to IACS</h1>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  img {
    max-height: 64px;
  }

  h1 {
    color: var(--blue);
    text-decoration: underline;
    text-decoration-color: var(--red);
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
