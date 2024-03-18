import type { Menuitem } from "../types";
import { HS_HANDBOOK, INNOVATOR, LIBRARY, LINKS, MS_HANDBOOK, STAFF_DIRECTORY, WEBSITE } from "./commonMenuItems";



export const familyMenu: Menuitem[] = [
  
  
  {
    title: "Food",
    items: [
      {
        title: "Lunch Menu",
        icon : './icons/lunch-menu.png',
        link: "https://drive.google.com/drive/folders/0B-fhMzqaF6ywMDNpZXFqMFk1dUE?resourcekey=0-Rl9upCRc9k7TfJJxYY0Csg",
      },
      {
        icon : './icons/payment.png',
        title: "Pay Online",
        link: "https://www.schoolpaymentportal.com/Default.aspx",
      },
      {
        link: "https://www.innovationcharter.org/food-nutrition-services/",
        title: "Lunch & Nutrition Page",
        icon : './icons/lunch.png',
      },
    ],
  },
 {
  title: "Logistics",
  items: [
    {
      title: "Transportation",
      link: "https://www.innovationcharter.org/transportation/",
      icon : './icons/bus.png',
    },
    {
      icon : './icons/chromebook.png',
      title: "Chromebook Contract",
      blackIcon: true,
      link: "https://www.innovationcharter.org/chromebook-contract/",
    },
    {
      title: "Forms",
      icon : './icons/forms.png',
      link: "https://www.innovationcharter.org/families/forms/",
    },
  
  {
    title : 'Links',
    items : [      
      LIBRARY,      
      INNOVATOR,      
    ]
  },],
}
  {
    title: "Middle School",
    items: [
      {
        title: "Course Syllabi (MS)",
        link: "https://drive.google.com/drive/folders/1DKrXE-nHFLOGQCKPmib6A8wHsrppewwg",
      },
      MS_HANDBOOK,           
      {
        title: "After School Program",
        link: "https://www.innovationcharter.org/current-students/after-school-program/",
      },
      
      {
        title: "Middle School Page",
        link: "https://www.innovationcharter.org/middle-school/",
      },
    ],
  },
  {
    title: "High School",
    items: [      
      {
        title: "Course Syllabi (HS)",
        link: "https://drive.google.com/drive/folders/1EiO_lQ-3cSRwd81-MEKAm15qs1vD7NeQ?usp=sharing",
      },
      HS_HANDBOOK,
      {
        title: "College Counseling",
        link: "https://www.innovationcharter.org/high-school/college-counseling/",
        icon : './icons/college.png',
        blackIcon: true,
      },
      {
        icon: "./icons/announcement.png",
        blackIcon: true,
        title: "Morning Announcements for Students",
        link: "https://docs.google.com/presentation/d/1x-mqD_2JWQJQyo00htRrQIDKbsNAxmn8EzV-dGGAUm0/edit?usp=sharing",
      },
      
      {
        title: "High School Page",
        link: "https://www.innovationcharter.org/high-school/",
      },
    ],
  },
  {
    title: "Student Services",
    items: [
      {
        title: "Student Services Page",
        link: "https://www.innovationcharter.org/student-services/",
      },
      {
        title: "DCAP",
        link: "https://www.innovationcharter.org/student-services/dcap/",
      },
      {
        title: "Section 504",
        link: "https://www.innovationcharter.org/student-services/section-504/",
      },
      {
        title: "Multilingual Learners",
        link: "https://www.innovationcharter.org/student-services/multilingual-learners/",
      },
      {
        title: "Special Education",
        link: "https://www.innovationcharter.org/special-education/",
      },
      {
        title: "SEPAC",
        link: "https://www.innovationcharter.org/families/sepac/",
      },
      {
        title: "Homework Boards",
        items: [
          {
            title: "5/6 Homework Board",
            link: "https://docs.google.com/spreadsheets/d/1YG_DhRd0nGlUDD9ZP-ru4SeJDLorG4xut62vPK5kt7s/edit?usp=sharing",
          },
          {
            title: "7/8 Homework Board",
            link: "https://docs.google.com/spreadsheets/d/1dfpuMMIPyUsRWyCFWorG32CCccFLjMT7E8yt5QmVDwI/edit#gid=74684334",
          },
          {
            title: "9/10 Homework Board",
            link: "https://docs.google.com/spreadsheets/d/1YtywQwi0lJjwGHZPvcRzx1vFBs4TDm_9vDC5tSRu_Yw/edit?usp=sharing",
          },
          {
            title: "11/12 Homework Board",
            link: "https://docs.google.com/spreadsheets/d/1yDYH_kKVo2L_3dSDi1U3FJZwX6ddwtmlrpn8HAro0iw/edit?usp=sharing",
          },
        ],
      },
    ],
  },
];
