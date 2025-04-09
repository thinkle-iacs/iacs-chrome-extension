import { school } from '../prefs';
import {ASPEN,GC,EHallpass,RESTORATIVE_FORM,STELLA, SCOIR, HS_ANNOUNCEMENTS, MS_ANNOUNCEMENTS, MS_HANDBOOK, HS_HANDBOOK, GOOGLE_APPS_WITH_ADOBE, BULLYING_PLAN, AMPLIFY, IXL, CLEVER, CHROMEBOOK_REPAIR_FORM, GOOGLE_APPS, EXPRESS, CREATIVECLOUD} from './commonMenuItems';,

export const menu = [
  // No more than FIVE items per menu
  {
    title: "Teaching",
    items: [
      ASPEN,
      GC, 
      {
        title : 'Panorama',
        icon : 'https://www.panoramaed.com/hubfs/logos/favicon.ico',
        link: 'https://mystudents.panoramaed.com/',
        detail: 'MTSS and Student Data'
      },
      {
        title: "Portfolios",
        detail: "Student Digital Portfolios in Google Drive",
        link: "https://drive.google.com/drive/folders/1VZE9D5iN_M4wwp-sv6kjbdxTWwLJpCzj",
      },
       {
        title: "HS Student Hour Scheduler",
        detail: "Magic spreadsheets ftw, RIP flextime manager",
        school: "HS",
        link: "https://docs.google.com/spreadsheets/d/14DnCFpaOSrULEHEIZQpwlkIc1KipZAn73owybMHoLZE/edit#gid=1301432640",
      },      
      {
        title : 'HS Teacher Detentions',
        link: 'https://docs.google.com/spreadsheets/d/1qLBtRQpOr88ZAs-SPZ5jr-z041AewQ48tgnDQeOk9T4/edit?gid=1154834993#gid=1154834993',
        school : 'HS'
      }
    ]},
  {
    title : 'WIN/Advisory',
    school : 'MS',
    items: [     
      {
        title: "5/6 WIN Scheduler",
        link: "https://docs.google.com/spreadsheets/d/1oSK2TLAPty3971bbPQqH3ETg7Gu1Y0bwjBrhRFlINSM/edit#gid=0",
        school: "MS",
      },
      {
        title: "7/8 WIN Scheduler",
        link: "https://docs.google.com/spreadsheets/d/1zyABqw9cT6ThcWJKhusdit5fKRbOh3GbCa9DjDZ-91M/edit#gid=0",
        school: "MS",
      },
      {
        title: "5/6 Advisory Calendar",
        school: "MS",
        link: "https://docs.google.com/document/d/1BEyrnfxIsW0jzC651E2RTUQEPXIKYnAOMHCkr8JEzXk/edit#heading=h.i2s1d35ym0e",
      },
      {
        title: "7/8 Advisory Calendar",
        school: "MS",        
        link: 'https://docs.google.com/spreadsheets/d/1py0K2nYK1Ea9ER_gVWV6Tcf38eNqxl66oQ8B-FGYMTM/edit?gid=0#gid=0',
      },
    ],
  },

  GOOGLE_APPS,
  
  {
    title: "Subscriptions",
    items: [
      AMPLIFY,
      IXL,
      {
        title: "Newsela",
        icon: "https://media-thumbs.golden.com/siO12OnGRxyTHjHnxMJLawNzTks=/200x200/smart/golden-storage-production.s3.amazonaws.com%2Ftopic_images%2F4dbe7e04d38d4d08b418252113d4fb4f.jpeg",
        detail: "Differentiated reading from news sources",
        link: "https://newsela.com/login/google-oauth2/?source=sign-in-without-class-code",
      },
      {
        title: "BrainPOP",
        link: "https://www.brainpop.com/",
        detail:
          "<strong><a href='https://sites.google.com/innovationcharter.org/teacher-tech/web-apps-subscriptions'>code on support page.</a></strong>",
      },
      CLEVER
    ],
  },
  {
    title : 'Forms',
    items : [
  {
            title: "Facilities Request Form",
            blackIcon: true,
            link: "https://docs.google.com/forms/d/e/1FAIpQLSeP4d1PEy7Ja4T1cuke0zReP3A4A9vIGHy_gYUkcTc_RYkQfw/viewform",
            icon: "./icons/hammer.png",
          },
          {
            title : 'Hall Pass Violation Form',
            link: 'https://docs.google.com/forms/d/e/1FAIpQLSc99BN_olPWybkPcWSfx84OiiDV5Umh9T_NyK8EDp9uigBzPw/viewform',
            school: 'HS'
          },
        {
          title: "Counseling Check-In Form",
          link: "https://forms.gle/Dy7h4yRReG7Etyxf7",
          detail: "Counseling Check-In Form for Students",
          icon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-counseling-funeral-service-flaticons-lineal-color-flat-icons.png",
        },
        RESTORATIVE_FORM,
        {
          title: "Incident Reporting Form",
          link: "https://docs.google.com/forms/d/e/1FAIpQLSe9qasAJbfEcJvF1wzXS4UWC3NSuX_IT0Ep_jwV7Qbr-zVYvQ/viewform",
        },
        {
          title : 'Sub Feedback',
          detail : 'Substitute Teacher Feedback Form',
          link : 'https://docs.google.com/forms/d/e/1FAIpQLScGaOkF-KTtzG4BmjorjkP2TFKP3iyvGkfHDqbgeMUTTf6bGA/viewform'
        },
      ]
  },
  {
      title : 'Technology & Library',
      items : [       
        {
            title: "Tech Support",
            link: "https://support.innovationcharter.org",
            detail: "IACS Tech How-To's and support",
            blackIcon: true,
            icon: "./icons/help.png",
          },   
           {
            title: "Library",
            link: "https://iacs.library.site",
          },
          {
          title : 'Schedule a Library Visit',
          detail : 'Use this calendar to schedule a class library visit',
          link : 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0VBVUnW9qSeonzAzktEzQ4Vy9vJ6hciTEAcItgYcJAxeu4MPjZyG2RaBhE6rG2ZeBkowfcIDCt?gv=true'
        }, 
          {
            title: "Computer Inventory",
            detail: "Finding Chromebooks",
            link: "https://cb.innovationcharter.org",
          },                  
        CHROMEBOOK_REPAIR_FORM,                               
      ]
    },
             
    {
      title: "Resources",
      items: [                                   
        {
          title: "School Website",
          link: "https://www.innovationcharter.org",
          icon: "./icons/iacs-icon.png",
        },                   
        {
          title: "Phone Extensions",
          link: "https://docs.google.com/spreadsheets/d/1kdsz1qF3F5E8BPgaQDOfOgqH0L0V2c8ICtqRxVFDf8Y/edit?usp=share_link",
          icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Telephone_icon_blue_gradient.svg/56px-Telephone_icon_blue_gradient.svg.png",
        },
        {
          title: "Staff Directory",
          link: "https://www.innovationcharter.org/about-iacs/faculty/",
        },
        SCOIR
      ],
    },  
    {
      title: "HR",
      items: [
        {
          title: 'PayCom',
          link: 'https://www.paycomonline.net/v4/ee/web.php/app/login',
          icon: 'https://www.paycomonline.net/favicon.ico',
          //detail: 'Time Off and Paycheck Info (new in 2025)',
          detail : 'Open Enrollment, Time Off & Paycheck Info',
          blackIcon : false,
      },
        /* {
          title: "ADP",
          link: "https://workforcenow.adp.com/",
          blackIcon: true,
          detail: "Time Off and Paycheck Info",
          icon: "./icons/adp.png",
        }, */
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
          link: "https://docs.google.com/document/d/16Ot670CdokUNUto9WmIor-zKqH0zFbiH1aATHxR-7iY/edit?usp=sharing",
          title: "IACS Employee Handbook",
        },          
      ],
    },          
    {
      title: "Announcements",
      items: [
        HS_ANNOUNCEMENTS,
        MS_ANNOUNCEMENTS,
        {
          title: "Weekly Updates (Staff)",
          link: "https://drive.google.com/drive/folders/1U9cv23A3A0wNDFO2fTi86SelB-N0q1Mg",
        },
      ],
    },
    {
      title: "Handbooks",
      items: [
        {
          title: "Faculty Handbook",
          link: "https://docs.google.com/document/d/1yq_lDqkH9_LN1EaYXOUpcJRPPY2E1lMVTfCZsah7opU/edit",
        },
        {
          title: 'IACS Grading Handbook',
          link : 'https://docs.google.com/document/d/1bbq0SNJsc0pBALq9IRNollzPZ9ukwZc48UNC-Kws7es/edit?tab=t.0#heading=h.hvntzso5rv2'
        },
        MS_HANDBOOK,
        HS_HANDBOOK,
      ],
    }
    { title : 'Procedures & Manuals',
      items : [
        {
          title: "MLL Policy and Procedures",
          link: "https://docs.google.com/document/d/141BkxSbPY6diXJnwFKJo3OOyh4BzTkuSWs1NskCPJ48/edit",
          detail: "Overview of Multilingual Learner program",
          icon : "./icons/mll.png",
        },
        {
          title: "504 Manual",
          link: "https://docs.google.com/document/d/1asGHr9dwqs3tSg1dvE60XGspSUPyoEBcVg3HqfNevcU/edit#heading=h.gjdgxs",
        },
        {
          title: "MTSS Handbook",
          link: "https://docs.google.com/document/d/16VQZ6wxBYWr2yyow8oa9RKs7tl41xINi53FcnBAk3xw/edit",
          detail: "Multi-Tiered Systems of Support",
        },
        BULLYING_PLAN
      ],
    },    
  // Short items last
    {
      title : 'Adobe',
      items: [
        EXPRESS,
        CREATIVECLOUD
      ]
    },
    
    {
      title: "Systems Thinking",
      items: [
        {
          title: "Loopy",
          link: "https://ncase.me/loopy/",
          detail: "A very simple tool for drawing loops",
        },
        STELLA,
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
          
        ],
      },
];
