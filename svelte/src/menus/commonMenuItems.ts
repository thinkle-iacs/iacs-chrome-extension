import type { Menuitem } from "../types";

export const RESTORATIVE_FORM: Menuitem = {
  title: "Restorative Circle Request",
  link: "https://docs.google.com/forms/d/e/1FAIpQLSfW4kDo1JEy2W6Htqp9e5DMuuzYEmInYy9EoyMRTTtdsdlcvw/viewform",
  icon: "./icons/restore.png",
};

export const HS_ANNOUNCEMENTS: Menuitem = {
  title: "Morning Announcements (HS)",
  link: "https://docs.google.com/presentation/d/1x-mqD_2JWQJQyo00htRrQIDKbsNAxmn8EzV-dGGAUm0/edit#slide=id.p",
  school: "HS",
  icon: "./icons/announcement.png",
  blackIcon: true,
};

export const MS_ANNOUNCEMENTS: Menuitem = {
  title: "Weekly Announcements (MS)",
  link: "https://docs.google.com/presentation/d/1SEKtzqpLbzkmMScxB4p4vi3guD18ZSAaPZiGhM5d_Zg/edit",
  school: "MS",
  icon: "./icons/announcement.png",
  blackIcon: true,
};

export const HS_HANDBOOK: Menuitem = {
  title: "HS Student Handbook",
  link: "https://www.innovationcharter.org/high-school/handbook/",
  school: "HS",
};
export const MS_HANDBOOK: Menuitem = {
  title: "MS Student Handbook",
  link: "https://docs.google.com/document/d/1MsR1ZJ2WVpAbKEnvhbG-a7w711mpT6Hl7wzOZ6idiI4/edit",
  school: "MS",
};
export const DESMOS: Menuitem = {
  title: "Desmos Calculator",
  link: "https://www.desmos.com/calculator",
  icon: "https://www.desmos.com/favicon.ico",
  detail: "Graphing Calculator",
};
export const SCOIR: Menuitem = {
  title: "SCOIR",
  link: "https://www.scoir.com/",
  detail: "College process",
  icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/cf/c6/98/cfc6987f-4081-dfb8-487e-65aaac25d9fa/AppIcon-0-1x_U007emarketing-0-7-0-85-220.png/60x60bb.jpg",
};
export const PIXLR: Menuitem = {
  link: "https://pixlr.com/",
  title: "Pixlr",
  detail: "Image editing software",
  icon: "https://pixlr.com/favicon.svg",
};

export const STELLA: Menuitem = {
  title: "Stella",
  link: "https://exchange.iseesystems.com/",
  detail: `Systems modeling software. <a href="https://docs.google.com/document/d/1DD3wVZm-sRlRcFWlOvQu73nEzLCnjZrbzeiNJJIqGNQ/edit">Info for accessing our licenses here.</a>`,
};

export const ASPEN: Menuitem = {
  title: "Aspen",
  link: "https://ma-innovation.myfollett.com/",
  detail: "Gradebook and Student Information System",
  icon: "./icons/aspen.ico",
};
export const EHallpass: Menuitem = {
  title: "E-Hallpass",
  link: "https://www.e-hallpass.com/login",
  detail:
    'More info on kiosk mode etc. <a href="https://sites.google.com/innovationcharter.org/teacher-tech/e-hallpass">here</a>',
  icon: "./icons/ehallpass.ico",
};
export const GC: Menuitem = {
  title: "Classroom",
  link: "https://classroom.google.com",
  icon: "./icons/classroom.png",
};
export const FTM: Menuitem = {
  title: "Flextime Manager",
  link: "https://flextimemanager.com/glogin",
  detail: "",
  icon: "https://flextimemanager.com/assets/images/ftm-logo-menu.svg",
};

export const EXPRESS: Menuitem = {
  title: "Adobe Express",
  link: "https://express.adobe.com/a/innovationcharter.org",
  detail:
    "Web-based graphic design and multimedia tools, including text, video and more.",
  icon: "./icons/AdobeExpress.png",
};

export const CREATIVECLOUD: Menuitem = {
  title: "Adobe Creative Cloud",
  link: "https://creativecloud.adobe.com/",
  icon: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg",
  detail: "Adobe's full suite of tools",
};

export const GOOGLE_APPS: Menuitem = {
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
      title: "Docs",
      link: "https://docs.google.com",
      icon: "./icons/docs.png",
    },
    {
      title: "Sites",
      link: "https://sites.google.com",
      icon: "./icons/sites.png",
    },
  ],
};

export const GOOGLE_APPS_WITH_ADOBE: Menuitem = {
  title: "", // Column...
  items: [GOOGLE_APPS, { title: "Adobe", items: [EXPRESS, CREATIVECLOUD] }],
};
export const WEBSITE = {
  title: "School Website",
  link: "https://www.innovationcharter.org",
  icon: "./icons/iacs-icon.png",
};
export const INNOVATOR = {
  title: "The Innovator",
  link: "https://www.theinnovator.org",
  icon: "https://theinnovator.org/wp-content/uploads/2015/10/cropped-newnewlogo_innovator_from_mayotte2-32x32.png",
  detail: "Innovation's student-run newspaper",
  blackIcon: true,
};
export const LIBRARY = {
  title: "Library",
  link: "https://iacs.library.site",
};
export const SCHOOL_CALENDAR = {
  title: "Calendar",
  link: "https://www.innovationcharter.org/calendar",
  icon: "./icons/school-calendar.png",
};
export const STAFF_DIRECTORY = {
  title: "Staff Directory",
  icon: "./icons/directory.png",

  link: "https://www.innovationcharter.org/about-iacs/faculty/",
};
export const LINKS = {
  title: "Links",
  items: [WEBSITE, INNOVATOR, LIBRARY, STAFF_DIRECTORY],
};
export const PARKING_FORM = {
  title: "Student Parking Application",
  link: "https://docs.google.com/document/d/1cjkcmqIjnYPS4PxXfsL-Xmz9fc0TOT3Ujc_aJ3KP3zo/edit?usp=sharing",
};
export const WORK_PERMIT = {
  title: "Work Permit Information",
  link: "https://docs.google.com/document/d/1cjkcmqIjnYPS4PxXfsL-Xmz9fc0TOT3Ujc_aJ3KP3zo/edit?usp=sharing",
};
export const COMM_SERV = {
  title: "Community Service Form",
  link: "https://docs.google.com/document/d/1mG5Z99WGS5pTlAIp1MvUigzkHdV8gwpbmxx9FySN5G8/edit?usp=sharing",
};
