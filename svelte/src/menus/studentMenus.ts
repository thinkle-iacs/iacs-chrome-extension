import {
  ASPEN,
  COMM_SERV,
  CREATIVECLOUD,
  DESMOS,
  EHallpass,
  EXPRESS,
  GC,
  GOOGLE_APPS,
  HS_ANNOUNCEMENTS,
  HS_HANDBOOK,
  LINKS,
  MS_ANNOUNCEMENTS,
  MS_HANDBOOK,
  PARKING_FORM,
  RESTORATIVE_FORM,
  SCOIR,
  STELLA,
} from "./commonMenuItems";

const studentapps = [ASPEN, GC, EHallpass];

const hsmenu = [
  {
    title: "",
    items: [
      {
        title: "Assignments",
        items: [ASPEN, GC],
      },
      {
        title: "Adobe",
        items: [EXPRESS, CREATIVECLOUD],
      },
    ],
  },

  {
    title: "Tools",
    items: [
      EHallpass,
      //FTM,
      SCOIR,
      {
        title: "",
        items: [DESMOS, STELLA],
      },
    ],
  },
  GOOGLE_APPS,
  {
    title: "Resources",
    items: [
      HS_ANNOUNCEMENTS,
      HS_HANDBOOK,
      {
        title: "Forms",
        items: [
          {
            title: "Incident Reporting Form",
            link: "https://docs.google.com/forms/d/e/1FAIpQLSe9qasAJbfEcJvF1wzXS4UWC3NSuX_IT0Ep_jwV7Qbr-zVYvQ/viewform",
          },
          {
            title: "Counseling Check-In Form",
            link: "https://forms.gle/Dy7h4yRReG7Etyxf7",
            detail: "Counseling Check-In Form for Students",
            icon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-counseling-funeral-service-flaticons-lineal-color-flat-icons.png",
          },
          RESTORATIVE_FORM,
          PARKING_FORM,
          COMM_SERV,
        ],
      },
    ],
  },
  LINKS,
];

const msmenu = [
  {
    title: "Assignments",
    items: [ASPEN, GC],
  },
  {
    title: "",
    items: [GOOGLE_APPS, EXPRESS],
  },
  {
    title: "Resources",
    items: [
      MS_HANDBOOK,
      {
        title: "Forms",
        items: [
          {
            title: "Incident Reporting Form",
            link: "https://docs.google.com/forms/d/e/1FAIpQLSe9qasAJbfEcJvF1wzXS4UWC3NSuX_IT0Ep_jwV7Qbr-zVYvQ/viewform",
          },
          {
            title: "Counseling Check-In Form",
            link: "https://forms.gle/Dy7h4yRReG7Etyxf7",
            detail: "Counseling Check-In Form for Students",
            icon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-counseling-funeral-service-flaticons-lineal-color-flat-icons.png",
          },
          RESTORATIVE_FORM,
        ],
      },
    ],
  },
  {
    title: "Links",
    items: [
      MS_ANNOUNCEMENTS,
      {
        title: "School Website",
        link: "https://www.innovationcharter.org",
        icon: "./icons/iacs-icon.png",
      },
      {
        title: "Library",
        link: "https://iacs.library.site",
      },
    ],
  },
];
