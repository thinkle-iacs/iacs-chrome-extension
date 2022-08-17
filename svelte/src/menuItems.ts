import type { Menuitem } from "./types";

export let defaultMenuItems: Menuitem[] = [
  {
    title: "Teaching",
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
      {
        title: "E-Hallpass",
        link: "https://www.e-hallpass.com/login",
        detail:
          'More info on kiosk mode etc. <a href="https://sites.google.com/innovationcharter.org/teacher-tech/e-hallpass">here</a>',
        icon: "./icons/ehallpass.ico",
      },
      {
        title: "Systems Thinking",
        items: [
          {
            title: "Loopy",
            link: "https://ncase.me/loopy/",
            detail: "A very simple tool for drawing loops",
          },
          {
            title: "Stella",
            link: "https://www.iseesystems.com/store/products/stella-online.aspx",
          },
        ],
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
      {
        title: "Other Apps",
        items: [
          {
            title: "LucidPress",
            link: "https://lucid.app/documents",
            detail: "Graphic design/Layout software",
          },
        ],
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
        title: "Announcements",
        items: [
          {
            title: "Morning Announcements (HS)",
            link: "https://docs.google.com/document/d/1a0DKFKRTXTYYvzluC05eSM8gyP7nLwGFBlFr0F8nyUs/edit",
          },
          {
            title: "Morning Announcements (MS)",
            link: "https://docs.google.com/presentation/d/1UW60oHMcDA_mnOnlRmTUVsM0FN5BoBxT9peX4dYITv4/edit?usp=sharing",
          },
          {
            title: "Weekly Updates (Staff)",
            link: "https://drive.google.com/drive/folders/1U9cv23A3A0wNDFO2fTi86SelB-N0q1Mg",
          },
        ],
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
      {
        link: "https://www.ezschoolapps.com/",
        title: "EZ Substitute",
        detail:
          'More info <a href="https://sites.google.com/innovationcharter.org/teacher-tech/staff-absences-ez-substitute-management">here</a>',
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
    ],
  },
];
