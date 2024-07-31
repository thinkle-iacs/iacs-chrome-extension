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
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
  }

  onMount(() => {
    window.googleTranslateElementInit = googleTranslateElementInit;
  });
</script>

<svelte:head>
  <script
    src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  ></script>
</svelte:head>

<div id="google_translate_element"></div>

<style>
  /* Add your styles here */
</style>
