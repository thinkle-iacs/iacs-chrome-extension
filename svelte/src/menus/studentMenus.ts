import {
  AMPLIFY,
  ASPEN,
  BULLYING_PLAN,
  CHROMEBOOK_REPAIR_FORM,
  CLEVER,
  COMM_SERV,
  CREATIVECLOUD,
  DESMOS,
  EXPRESS,
  GC,
  GOOGLE_APPS,
  HS_ANNOUNCEMENTS,
  HS_EXTRA_HELP,
  HS_HANDBOOK,
  LINKS,
  MS_ANNOUNCEMENTS,
  MS_HANDBOOK,
  PARKING_FORM,
  //RESTORATIVE_FORM,
  SCOIR,
  STELLA,
} from "./commonMenuItems";

const FOOD = {
  title: "Food",
  items: [
    {
      title: "Lunch Menu",
      icon: "./icons/lunch-menu.png",
      link: "https://drive.google.com/drive/folders/0B-fhMzqaF6ywMDNpZXFqMFk1dUE?resourcekey=0-Rl9upCRc9k7TfJJxYY0Csg",
    },
    {
      link: "https://www.innovationcharter.org/food-nutrition-services/",
      title: "Lunch & Nutrition Page",
      icon: "./icons/lunch.png",
    },
  ],
};

const studentapps = [ASPEN, GC];

export const hsmenu = [
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
      CLEVER,
    ],
  },

  {
    title: "Tools",
    items: [
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
      HS_EXTRA_HELP,
      HS_HANDBOOK,
      BULLYING_PLAN,
      {
        title: "Ms. LeMay's Counseling Check-In Form",
        link: "https://docs.google.com/forms/d/e/1FAIpQLSehqbNQjtjqxqsZA-UKVOCSDA7Xo1yJXyaFF72S9caFQZE0EA/viewform?usp=header",
        detail: "Counseling Check-In Form for Students in grades 8-12",
        icon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-counseling-funeral-service-flaticons-lineal-color-flat-icons.png",
      },
    ],
  },
  {
    title: "Forms",
    items: [
      CHROMEBOOK_REPAIR_FORM,
      {
        title: "Incident Reporting Form",
        link: "https://docs.google.com/forms/d/e/1FAIpQLSe9qasAJbfEcJvF1wzXS4UWC3NSuX_IT0Ep_jwV7Qbr-zVYvQ/viewform",
      },
      //RESTORATIVE_FORM,
      PARKING_FORM,
      COMM_SERV,
    ],
  },

  LINKS,
  FOOD,
  {
    title: "Academics",
    items: [
      {
        title: "Stem Endorsement Program",
        link: "https://docs.google.com/document/d/1_aleqnQHQZ9b7ngLPSOrSXxub0p9YL4l9yIjxjyfb00/edit?tab=t.0",
      },
      {
        title: "STEM Enrichment Opportunities",
        link: "https://docs.google.com/presentation/d/1flyZQ6-JhWaIXTh3h-rxV_rSzYhu2KErwdnNib2mv3o/edit?slide=id.g729dd71725_7_214#slide=id.g729dd71725_7_214",
      },
    ],
  },
];

export const msmenu = [
  {
    title: "Assignments",
    items: [
      ASPEN,
      GC,
      AMPLIFY,
      {
        title: "Lexia",
        detail: "Lexia Core 5 Reading Program",
        link: "https://www.lexiacore5.com/register",
        icon: "https://www.lexiacore5.com/icons/icon.svg",
      },
    ],
  },
  {
    title: "",
    items: [
      GOOGLE_APPS,
      {
        title: "Other Apps",
        items: [EXPRESS, CLEVER],
      },
    ],
  },
  {
    title: "",
    items: [
      {
        title: "Resources",
        items: [MS_HANDBOOK, BULLYING_PLAN],
      },
      {
        title: "Forms",
        items: [
          CHROMEBOOK_REPAIR_FORM,
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
          //RESTORATIVE_FORM,
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
  FOOD,
];
