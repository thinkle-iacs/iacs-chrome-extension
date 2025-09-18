import { derived, writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";
import type { Menuitem } from "../types";
import type { SchoolType } from "../prefs";
import { defaultMenuItems } from "../menuItems";
import { familyMenu } from "../menus/familyMenu";
import { menu } from "../menus/staffMenu";
import { hsmenu, msmenu } from "../menus/studentMenus";
import { customMenuStore } from "../CustomMenus/customMenu";
import { CachedDataStore } from "./dataFetcher";

// Mode type for menu composition
export type MenuMode = "Staff" | "HS" | "MS" | "Family";

// Function to get base menu items for a given mode
export function getBaseModeMenuItems(mode: MenuMode): Menuitem[] {
  switch (mode) {
    case "Staff":
      return menu as Menuitem[];
    case "Family":
      return familyMenu as Menuitem[];
    case "HS":
      return hsmenu as Menuitem[];
    case "MS":
      return msmenu as Menuitem[];
    default:
      return defaultMenuItems as Menuitem[];
  }
}

// Function to assign IDs to menus (copied from Menu.svelte)
export function assignIds(menus: Menuitem[], parentId = ""): Menuitem[] {
  return menus.map((menu, index) => {
    const id = parentId ? `${parentId}-${index}` : `${index}`; // Unique hierarchical ID
    const newMenu = { ...menu, id }; // Assign the ID

    // Recursively assign IDs to sub-menu items
    if (menu.items && menu.items.length > 0) {
      newMenu.items = assignIds(menu.items, id);
    }

    return newMenu;
  });
}

// IACS menu transformation function (copied from Menu.svelte)
type IACSMenuItem = {
  ID: number;
  title: string;
  url: string;
  parent: string;
};

type IACSMenuJson = {
  status: "OK";
  code: number;
  data: {
    menu_id: number;
    menu_name: string;
    menu_items: IACSMenuItem[];
  }[];
};

export function iacsMenuToMenu(
  item: IACSMenuItem,
  menu: IACSMenuItem[],
  level: number = 0
): Menuitem {
  let items = menu
    .filter((i) => parseInt(i.parent) == item.ID)
    .map((i) => iacsMenuToMenu(i, menu, level + 1));
  let menuitem: Menuitem = {
    title: item.title,
  };
  if (item.url && item.url != "#") {
    menuitem.link = item.url;
  }
  if (items.length) {
    menuitem.items = items;
  }
  // Auto-collapse levels beyond 1
  if (level >= 1 && items.length) {
    // This would need access to collapsedMenus store - we'll handle this in the caller
    menuitem.collapse = true;
  }
  // Set school based on title
  if (menuitem.title.search(/\bhs\b/i) != -1) {
    menuitem.school = "HS" as SchoolType;
  } else if (menuitem.title.search(/\bms\b/i) != -1) {
    menuitem.school = "MS" as SchoolType;
  }
  return menuitem;
}

// Create IACS menu data store
export function createIacsMenuStore(mode: MenuMode): {
  store: Readable<Menuitem[]>;
  update: () => void;
} {
  if (mode === "Staff") {
    return {
      store: writable([]),
      update: () => {}, // No-op for staff mode
    };
  }

  const cachedIacsMenu = new CachedDataStore({
    url: `https://www.innovationcharter.org/wp-json/wcra/v1/getmenu/?secret_key=xvUGieok96ky4rDPgsSCf5B8HRsiejzo`,
    defaultValue: [],
    expiresAfter: 8 * 60 * 60 * 1000,
    name: "iacsMenu",
    transformer: (jsonResponse: IACSMenuJson) => {
      if (jsonResponse.code != 200) {
        console.error(
          "Invalid response from IACS menu: ",
          jsonResponse.code,
          jsonResponse
        );
        return [];
      }
      let menu = jsonResponse.data.find((m) => m.menu_name == "Main Menu");
      if (!menu) {
        console.error(
          "No main menu found in IACS menu response: ",
          jsonResponse
        );
        return [];
      }
      const parents = ["MS Athletics", "HS Athletics"];
      let parentsItems = menu.menu_items.filter((item) =>
        parents.includes(item.title)
      );
      return [
        {
          title: "",
          items: parentsItems.map((i) => iacsMenuToMenu(i, menu.menu_items, 1)),
        } as Menuitem,
      ];
    },
  });

  return {
    store: cachedIacsMenu.store,
    update: () => cachedIacsMenu.update(),
  };
}

// Main function to create composed menu items store
export function createComposedMenuItems(mode: MenuMode): {
  store: Readable<Menuitem[]>;
  updateIacsMenu: () => void;
} {
  const baseModeMenuItems = getBaseModeMenuItems(mode);
  const menuStore = writable(baseModeMenuItems);
  const iacsMenu = createIacsMenuStore(mode);

  const store = derived(
    [menuStore, iacsMenu.store, customMenuStore],
    ([$menuStore, $iacsMenuItems, $customMenuItems]) =>
      assignIds([...$menuStore, ...$iacsMenuItems, ...$customMenuItems])
  );

  return {
    store,
    updateIacsMenu: iacsMenu.update,
  };
}
