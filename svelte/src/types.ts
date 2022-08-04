export type Menuitem = {
  link?: string;
  items?: Menuitem[];
  detail?: string;
  icon?: string;
  title: string;
};

export type Card = {
  title: string;
  image?: string;
  detail: string;
};

export type Tip = {
  title: string;
  content: string;
  link?: string;
  image?: string;
};
