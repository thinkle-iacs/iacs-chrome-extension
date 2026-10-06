<script lang="ts">
  import VideoPlayer from "../whimsy/VideoPlayer.svelte";
  import VideoPlayerToast from "./VideoPlayerToast.svelte";
  import { school, whimsy, videoPlayerToastClicked } from "../prefs";

  // Add new issues anywhere in this list -- no need to keep it in order.
  // Issues are sorted below by volume/issue number (so e.g. "V20 I2" sorts
  // after "V20 I1", which sorts after "V19 I11"). The newest becomes
  // "latest", which reopens the toast bubble for everyone, and every older
  // issue stays browsable in the dropdown instead of living on as
  // commented-out code.
  type InnovatorIssue = {
    volume: number;
    issueNumber: number;
    // The theme/title of the issue, if it had one -- the "Vol. X, Issue Y"
    // part of the display label is generated, so every issue reads the
    // same way instead of each one inventing its own name format.
    subtitle?: string;
    driveUrl?: string;
    youtubeUrl?: string;
  };

  const issues: InnovatorIssue[] = [
    {
      volume: 20,
      issueNumber: 2,
      subtitle: "Homecoming",
      driveUrl:
        "https://drive.google.com/file/d/1yaEhUu3J3LUK1BFnRNmB-si7zGixAM6-/view?usp=drive_link",
      youtubeUrl: "https://youtu.be/C0KFJXDak7E",
    },
    {
      volume: 20,
      issueNumber: 1,
      subtitle: "Welcome Back!",
      driveUrl:
        "https://drive.google.com/file/d/1GAv7Q183i89EMpDIqsSfmIZMsXNqLU-d/view?usp=drive_link",
      youtubeUrl:
        "https://www.youtube.com/watch?v=ds-li8eNOF4&source_ve_path=OTY3MTQ&embeds_referring_euri=https%3A%2F%2Ftheinnovator.org%2F",
    },
    {
      volume: 19,
      issueNumber: 11,
      subtitle: "Goodbye Seniors!",
      driveUrl:
        "https://drive.google.com/file/d/1i7-e0dOKCVCUX2fayppJgAmbKG7W1wH9/view",
      youtubeUrl: "https://www.youtube.com/watch?v=WincwIdzQCY",
    },
    {
      volume: 19,
      issueNumber: 10,
      subtitle: "POP Week is Over",
      driveUrl:
        "https://drive.google.com/file/d/12IyPlfkTOtM-_S2EJpRbLqDtG5u9ChyD/view?usp=drive_link",
      youtubeUrl: "https://www.youtube.com/watch?v=vBbDIliGzeI",
    },
    {
      volume: 19,
      issueNumber: 9,
      subtitle: "Should AI Be Banned at IACS?",
      driveUrl:
        "https://drive.google.com/file/d/1p1n19xU2JhCP-JFkQAKFBIuZthekTYwX/view?usp=drive_link",
      youtubeUrl: "https://www.youtube.com/watch?v=a9TcBy52WRQ",
    },
    {
      volume: 19,
      issueNumber: 8,
      subtitle: "Fit Check!",
      driveUrl:
        "https://drive.google.com/file/d/16ujbl7L_z5Jf0y6uO1ZOeo4TipmuePdH/view?usp=sharing",
    },
    {
      volume: 19,
      issueNumber: 4,
      subtitle: "Join Us!",
      driveUrl:
        "https://drive.google.com/file/d/1CvWm6E3ng-jRalDF3vBITh304sIzOtBW/view?usp=drive_link",
    },
    {
      volume: 19,
      issueNumber: 3,
      subtitle: "A Harvest of Memories",
      driveUrl:
        "https://drive.google.com/file/d/1FN18cyyGEbl9DqEWCBx4HK7nmrod2vwV/view?usp=drive_link",
      youtubeUrl: "https://www.youtube.com/watch?v=xG5rpfxizKY",
    },
    {
      volume: 19,
      issueNumber: 2,
      subtitle: "Highlighting Student Art",
      driveUrl:
        "https://drive.google.com/file/d/1hfkpi9fTaXuvqUD6uNkpBOYySJKz_Nof/view?usp=sharing",
      youtubeUrl: "https://youtu.be/0iE5uY-WdmU",
    },
    {
      volume: 19,
      issueNumber: 1,
      driveUrl:
        "https://drive.google.com/file/d/1_ZhSk0waHaLjTFJhRlYLDr0rwjTYZlpU/view?usp=drive_link",
      youtubeUrl: "https://www.youtube.com/watch?v=qdENYZKWXTQ",
    },
    // Editions 5-7 (volume 19) are missing from the project's history --
    // if source files for them ever turn up, add them in here the same way.
  ];

  function sortKey(issue: InnovatorIssue) {
    return issue.volume * 1000 + issue.issueNumber;
  }

  function label(issue: InnovatorIssue) {
    const subtitle = issue.subtitle ? `: "${issue.subtitle}"` : "";
    return `Vol. ${issue.volume}, Issue ${issue.issueNumber}${subtitle}`;
  }

  const sortedIssues = [...issues].sort((a, b) => sortKey(b) - sortKey(a));

  let selectedKey = sortKey(sortedIssues[0]);
  $: selected =
    sortedIssues.find((issue) => sortKey(issue) === selectedKey) ??
    sortedIssues[0];
  $: latestKey = sortKey(sortedIssues[0]);
  $: videoLinks = [
    ...(selected.driveUrl
      ? [
          {
            url: selected.driveUrl,
            type: "google-drive" as const,
            title: label(selected),
            tabtitle: "Drive",
          },
        ]
      : []),
    ...(selected.youtubeUrl
      ? [
          {
            url: selected.youtubeUrl,
            type: "youtube" as const,
            title: label(selected),
            tabtitle: "YouTube",
          },
        ]
      : []),
  ];
</script>

{#if $school === "HS" || $school === "All"}
  <!-- Video Player Toast -->
  {#if $whimsy && $school === "HS"}
    <VideoPlayerToast
      toastIndex={latestKey}
      visible={$school === "HS" || $school == "All"}
    >
      <span class="text"
        >Check out the new Video from <i>The Innovator</i>!</span
      >
    </VideoPlayerToast>
  {/if}
  {#key selectedKey}
    <VideoPlayer id={`innovator-${selectedKey}`} {videoLinks}>
      <div slot="footer-extra" class="footer-extra">
        <a href="https://theinnovator.org">See more at theinnovator.org</a>
        {#if sortedIssues.length > 1}
          <select
            class="back-issues"
            bind:value={selectedKey}
            aria-label="Choose an Innovator issue"
          >
            {#each sortedIssues as issue}
              <option value={sortKey(issue)}>
                {sortKey(issue) === latestKey ? "Latest: " : ""}{label(issue)}
              </option>
            {/each}
          </select>
        {/if}
      </div>
    </VideoPlayer>
  {/key}
{/if}

<style>
  :global(h1, h2, h3, h4, h5, h6) {
    font-weight: var(--bold);
  }
  :root {
    --white: white;
    --black: black;
    --darkgrey: #373737;
    --mediumgrey: #4a4a4a;
    --lightgrey: #aaa;
    --blue: #0033a0;
    --red: #c6093b;
    --darkshadow: #000000e1;
    --tiny: 10px;
    --small: 12px;
    --normal: 16px;
    --big: 24px;
    --huge: 48px;
    --icon-size: 32px;
    --skinny: 200;
    --bold: 500;
    --spacer: 12px;
    --dark-overlay: #000c;
    --light-text: #efefff;
    --cursive: "Tangerine", cursive;
    --pad: 4px;
    --card-width-small: calc(min(200px, 100vw));
    --card-width: calc(min(404px, 100vw));
    --card-width-double: calc(min(808px, 100vw));
    --bar-height: 48px;
    --medium-big-screen: 1100px;
    --smaller-screen: 800px;
    --off-white: #fffef9;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --off-white: #0d0d11;
      --white: black;
      --black: white;
      --darkgrey: #cfcfcf;
      --lightgrey: #515151;
      --mediumgrey: #afafaf;
      --blue: #a4c1ff;
      --red: #f9b4c7;
      --darkshadow: #ffffffd1;
    }
  }

  .overlay {
    position: fixed;
    opacity: 1;
    background-color: var(--darkshadow);
    display: grid;
    place-content: center;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .overlay > :global(button) {
    position: absolute;
    right: var(--spacer);
    top: var(--spacer);
    background-color: var(--white);
  }
  .hidden {
    color: transparent;
  }
  .footer-extra {
    display: flex;
    align-items: center;
    gap: var(--spacer);
    flex-wrap: wrap;
  }
  .back-issues {
    font-size: var(--small);
  }
</style>
