<script type="typescript">
  import StaffMember from "./StaffMember.svelte";
  import StaffGuessingGame from "./StaffGuessingGame.svelte";
  import type { StaffData } from "./types";

  let jsonData = [];

  let staffMembers: StaffData[] = [];

  async function getStaff() {
    let offset = 0;
    let keepFetching = true;
    while (keepFetching) {
      console.log("Fetch from ", offset);
      let response = await fetch(
        `https://www.innovationcharter.org/wp-json/wp/v2/staff?per_page=100&offset=${offset}`
      );
      let json = await response.json();
      console.log(json);
      jsonData = [...jsonData, json];
      staffMembers = [
        ...staffMembers,
        ...json.filter(
          (member) =>
            member?.acf?.staff_department?.find &&
            member?.acf?.staff_department?.find((d) => d.name == "Main Staff")
        ),
      ];
      if (json.length == 100) {
        offset += 100;
        keepFetching = true;
      } else {
        keepFetching = false;
      }
    }
    playGame = true;
  }
  let playGame = false;
</script>

{#if !staffMembers.length}
  <button on:click={getStaff}>Play Guess-that-Staff Game...</button>
{:else if !playGame}
  <button on:click={() => (playGame = true)}>Play the Staff Game!</button>
{/if}
{#if playGame}
  <StaffGuessingGame
    closeGame={() => {
      console.log("Closing game");
      playGame = false;
    }}
    staff={staffMembers.filter((sm) => sm.acf.profile_image)}
  />
{/if}

<!-- Got {staffMembers.length} total staff...
  {#each staffMembers.slice(0, 5) as staffMember}
    <hr />
    <StaffMember {staffMember} />
    {JSON.stringify(
      staffMember
    )}
    <hr />
  {/each} -->
<style>
  button {
    border: 1px solid transparent;
    border-radius: 15px;
    transition: all 300ms;
    background-color: var(--blue);
    color: var(--white, "white");
    font-weight: var(--bold);
    padding: calc(3 * var(--pad));
  }
  button:hover {
    border: 1px solid var(--red);
  }
</style>
