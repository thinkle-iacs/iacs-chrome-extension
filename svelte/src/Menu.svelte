<script lang="typescript">
  import type { Menuitem } from "./types";
  import SubMenu from "./SubMenu.svelte";
  let menuItems: Menuitem[] = [
    {
      title: "Teaching & Grading",
      items: [
        {
          title: "Aspen",
          link: "https://ma-innovation.myfollett.com/",
          detail: "Gradebook and Student Information System",
          icon: "./icons/aspen.ico",
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
        {
          title: "ADP",
          link: "https://workforcenow.adp.com/",
          detail: "Time Off and Paycheck Info",
          icon: "./icons/adp.png",
        },
        {
          title: "Employee Navigator",
          link: "https://fredcchurch.employeenavigator.com/",
          detail: "Benefits",
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "Facilities Request Form",
          link: "https://docs.google.com/forms/d/e/1FAIpQLScl-fZa2mfc1DQXlyo0fMGY2l6w0He3xdVxWJeZ6U5dqw4yEg/viewform",
          icon: "./icons/hammer.png",
        },
        {
          title: "Tech Support",
          link: "https://support.innovationcharter.org",
          detail: "IACS Tech How-To's and support",
          icon: "./icons/help.png",
        },
        {
          title: "School Website",
          link: "https://www.innovationcharter.org",
          icon: "./icons/iacs-icon.png",
        },
        {
          title: "Library",
          link: "https://iacs.library.site",
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
          icon: "./icons/procurify.png",
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
