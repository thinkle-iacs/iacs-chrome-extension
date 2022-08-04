<script type="typescript">
  import StaffMember from "./StaffMember.svelte";
  import StaffGuessingGame from "./StaffGuessingGame.svelte";
  import type { StaffData } from "./types";

  let jsonData = [];

  let staffMembers: StaffData[] = [];

  async function getStaff() {
    let firstResponse = await fetch(
      "https://raw.githubusercontent.com/thinkle-iacs/web-design-portfolio/master/design/affordances.html"
    );
    let offset = 0;
    let keepFetching = true;
    let text = await firstResponse.text();
    console.log("Got text!", text);
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
  <button on:click={getStaff}>Load Staff...</button>
{:else if !playGame}
  <button on:click={() => (playGame = true)}>Play the Staff Game!</button>
{/if}
{#if playGame}
  <StaffGuessingGame
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
