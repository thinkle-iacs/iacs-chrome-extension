import {writable} from 'svelte/store';
import type {Writable} from 'svelte/store';
import type {Menuitem} from '../types';

export let customMenuStore : Writable<Menuitem[]> = writable(
  []   
);

let locallyStored = localStorage.getItem('custom-menu-items');
if (locallyStored) {
  try {
    let value = JSON.parse(locallyStored);
    customMenuStore.set(value);
  }
}

function removeEmpty (items : Menuitem[]) {
  function isNotEmpty (v) {
    if (!v.link && (!v.items || v.items.length==0)) {
      return false;
    } else {
      return true;
    }
  }
  function crawl (items) {
    for (let i of items) {
      if (i.items) {
        i.items = i.items.filter(isNotEmpty);
        crawl(i.items);
      }
    }
    return items.filter(isNotEmpty);
  }
  items = items.filter(isNotEmpty);
  return items;
}

function markAllItemsEditable (v : Menuitem) {
  v.editable = true;
  if (v.items) {
    v.items.map(markAllItemsEditable);
  }
}

customMenuStore.subscribe(
  (v)=>{
    v.map(markAllItemsEditable);
    v = removeEmpty(v);    
    localStorage.setItem(
      'custom-menu-items', 
      JSON.stringify(v)
      )
  }
)

export const customManager = {
  updateItem (i) {
    customMenuStore.update((v)=>v);
  },
  moveUp (i) {

  },
  moveDown (i) {

  },
  deleteItem (toRemove) {
    customMenuStore.update(
      (v)=>{
        function removeItem (items) {
          items = items.filter((val)=>val!=toRemove);
          items.map(
            (i)=>{
              if (i.items) {
                i.items = removeItem(i.items)
              }
            }
          );
          return items;
        }
        return removeItem(v);        
      }
    );
  }
}