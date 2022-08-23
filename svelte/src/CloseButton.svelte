<button on:click on:mouseover on:mouseenter on:mouseleave on:blur>
  &times;
</button>

<style>
  button {
    border: none;
    background-color: unset;
    display: grid;
    place-content: center;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    border: 1px solid var(--lightgrey);
  }
  button:hover {
    border: 1px solid var(--black, "black");
    transition: border 300ms;
  }
</style>
