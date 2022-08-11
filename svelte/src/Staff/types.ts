export type StaffDept = {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  term_taxonomy_id: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  filter: string;
  term_order: string;
};
export type StaffData = {
  link: string;
  id: string;
  acf: {
    profile_image: number;
    staff_department: StaffDept[];
    primary_department: StaffDept;
    department_intro_title: "";
    first_name: "Andrew";
    last_name: "Iovanna";
    staff_title: "Trustee";
    phone_extension: "";
    email_address: "aiovanna@innovationcharter.org";
    staff_member_bio: '<div dir="ltr">Andrew is a graduate of Murdoch Middle School (2007) and was a member of the inaugural high school class at Innovation Academy (graduating in 2011). Andrew graduated from Worcester Polytechnic Institute (WPI) in 2015 with a Bachelor of Science in Computer Science. In his time there he founded WPI&#8217;s first and only open-to-all-students makerspace, leading the organization as President in his Sophomore year. <span style="color: #000000;">Andrew&#8217;s passion for education started at IACS where he completed his senior thesis on the history of public education in America. He went on to advise the Copenhagen Business School on designing classrooms to maximize collaboration and lesson flexibility during his Junior year at WPI.</span></div>\n<div dir="ltr"> </div>\n<div dir="ltr"><span style="color: #000000;">Andrew has worked his entire professional career at Wayfair.com, where he developed inventory monitoring systems, automated price change applications for millions of products an hour, and improved the customer experience for mis-delivered items, in addition to other projects. In his free time Andrew enjoys running, playing soccer, gardening, and advocating for more livable and affordable civic spaces.</span></div>\n';
    sidebar_links: "";
    sidebar_cta_text: "";
    quote_background: false;
    quote_text: "";
    quote_cite: "";
  };
};
