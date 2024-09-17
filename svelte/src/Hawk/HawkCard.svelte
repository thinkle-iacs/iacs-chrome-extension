<script lang="ts">
  import Card from "../Card.svelte";
  import { fetchHawkContent } from "./hawkFetcher";
  let hawkContent: string = "";
  let error: string | null = null;
  let isLoading = true;

  // Fetch content when the component mounts
  async function getHawkContent() {
    try {
      const { content, cached } = await fetchHawkContent();
      hawkContent = content;
      console.log(`Content loaded from ${cached ? 'cache' : 'network'}`);
    } catch (err) {
      error = "Failed to load Hawk content.";
    } finally {
      isLoading = false;
    }
  }

  // Call function on mount
  getHawkContent();
</script>

<Card id="HawkNewsletter">
  <div class="slot" slot="head">
    <div class="fancy">The Hawk Newsletter</div>        
  </div>

  <div class="slot hawk-content" slot="body">
    {#if isLoading}
      <div>Loading...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else}
      {@html hawkContent}
    {/if}
  </div>

  <div class="slot" slot="footer">
    <a href="https://script.google.com/macros/s/AKfycbwX8Rhfv67ua0tFMBFqEDcuBH5tgHKsKfSYmbtrFgeJcnpS4K6pmgFwQoUFbUgNAZs3/exec?full=true" target="_blank">See More</a>
  </div>
</Card>

<style>
  div {
    max-width: 500px;
  }

  .content {
    text-align: left;
  }

  .error {
    color: red;
    font-weight: bold;
  }
  .hawk-content :global(a h2::after) {
    content: '↗'; /* External link icon */
    display: inline-block;
    border: 1px solid currentColor; /* Matches the text color */
    padding: 0.2em;
    margin-left: 0.3em; /* Add some spacing between text and icon */
    border-radius: 0.2em; /* Slight rounding of the box corners */
    font-size: 0.8em; /* Scale down the icon slightly */
    line-height: 1;
    transform: scale(0.8)translateY(-5px);
    opacity: 0.5;
  }
  .hawk-content :global(a:hover h2::after) {
    color: var(--blue);
    opacity: 1;
  }
  .hawk-content :global(a:hover h2) {
    color: var(--blue);
    text-decoration: underline;
  }
</style>