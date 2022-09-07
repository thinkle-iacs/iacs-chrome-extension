<script context="module" language="ts">
  let imageCache = {};
</script>

<script lang="ts">
  export let showName = true;
  export let showRole = true;
  import type { StudentData } from "./types";
  export let student: StudentData;
</script>

<div class="staff-box">
  {#if student.image}
    <img src={student.image} />
  {:else}
    <div class="image-placeholder">fetching image...</div>
  {/if}
  {#if showName}
    <h4>
      {student.first}
      {student.last}
      <br /><span class="phonetic">{student.phonetic}</span>
      <br /><span class="pronouns">{student.pronouns}</span>
    </h4>
  {/if}
  {#if showRole}
    Birthday: {student.bday}
  {/if}
</div>

<style>
  .staff-box {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding: var(--pad);
    gap: var(--pad);
  }
  img {
    border-radius: 5px;
  }
  .image-placeholder {
    width: 200px;
    height: 200px;
    background-color: var(--lightgrey);
  }

  img {
    max-width: 200px;
    max-height: 200px;
  }
  h4,
  h5 {
    margin: 0;
  }
</style>
