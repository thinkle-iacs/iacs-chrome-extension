<script lang="typescript">
  import type Menuitem from "./types";
  import SubMenu from "./SubMenu.svelte";
  let menuItems: Menuitem[] = [
    {
      title: "Teaching & Grading",
      items: [
        {
          title: "Aspen",
          link: "https://ma-innovation.myfollett.com/",
          detail: "Gradebook and Student Information System",
        },
        {
          title: "Classroom",
          link: "https://classroom.google.com",
          icon: "./icons/classroom.png",
        },
      ],
    },
    {
      title: "Google Apps",
      items: [
        {
          title: "GMail",
          link: "http://mail.innovationcharter.org",
          icon: "./icons/gmail.png",
        },

        {
          title: "Calendar",
          link: "http://calendar.innovationcharter.org",
          icon: "./icons/calendar.png",
        },
        {
          title: "Drive",
          link: "https://drive.google.com",
          icon: "./icons/drive.png",
        },
      ],
    },
    {
      title: "HR",
      items: [
        { title: "ADP", link: "https://workforcenow.adp.com/" },
        { title: "Employee Navigator", link: "aaa" },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "Tech Support",
          link: "https://support.innovationcharter.org",
          detail: "IACS Tech How-To's and support",
        },
        {
          title: "School Website",
          link: "www.innovationcharter.org",
        },
        {
          title: "Library",
          link: "iacs.library.site",
        },
        {
          title: "Staff Directory",
          link: "https://www.innovationcharter.org/about-iacs/faculty/",
        },
      ],
    },
    {
      title: "Purchases",
      items: [
        {
          title: "Procurify",
          detail: "Ordering stuff",
          link: "https://iacs.procurify.com",
        },
        {
          title: "Computer Inventory",
          detail: "Finding Chromebooks",
          link: "https://cb.innovationcharter.org",
        },
      ],
    },
  ];
</script>

<nav>
  {#each menuItems as menuitem}
    <SubMenu {menuitem} />
  {/each}
</nav>

<style>
  nav {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    justify-content: space-around;
    gap: 10px;
    border: 1px solid var(--lightgrey);
  }
</style>
