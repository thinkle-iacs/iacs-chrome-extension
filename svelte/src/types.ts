import type { SchoolType } from "./prefs";

export type Menuitem = {
  link?: string;
  items?: Menuitem[];
  detail?: string;
  icon?: string;
  title: string;
  blackIcon?: boolean;
  school?: SchoolType;
  editable?: boolean;
  collapse?: boolean;
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
