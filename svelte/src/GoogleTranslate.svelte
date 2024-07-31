<script lang="ts">
  import { onMount } from "svelte";

  declare global {
    interface Window {
      googleTranslateElementInit: () => void;
    }
  }

  function googleTranslateElementInit() {
    new google.translate.TranslateElement(
      {
        pageLanguage: "en",
      },
      "google_translate_element"
    );
  }

  onMount(() => {
    window.googleTranslateElementInit = googleTranslateElementInit;
  });
  let showAll = false;

  function translateToSpanish() {
    window.location.hash = "#googtrans(en|es)";
    location.reload();
  }

  function translateToKhmer() {
    window.location.hash = "#googtrans(en|km)";
    location.reload();
  }
</script>

<svelte:head>
  <script
    src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  ></script>
</svelte:head>

<div class="translate">
  <a href="#googtrans(en|es)" class="notranslate" on:click={translateToSpanish}
    >Español</a
  >
  |
  <a href="#googtrans(en|km)" on:click={translateToKhmer}>ខ្មែរ</a> |
  <a href="#" on:click={() => (showAll = !showAll)}>Translate</a>
</div>

<div class:hidden={!showAll} id="google_translate_element"></div>

<style>
  .hidden {
    visibility: hidden;
  }
  /* Add your styles here */
</style>
