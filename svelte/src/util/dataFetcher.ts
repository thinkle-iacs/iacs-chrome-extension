import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export class CachedDataStore {
  store: Writable<any>;
  name: string;
  expiresAfter: number;
  expireName: string;
  expiration: number;
  url: string;
  expirationStore: Writable<number>;
  updatingStore: Writable<boolean>;
  transformer: (value: any) => any;

  constructor({
    expiresAfter = 24 * 60 * 60 * 1000,
    url = "",
    name = "store",
    defaultValue = {},
    transformer = (value) => value,
  }: {
    expiresAfter: number;
    url: string;
    name: string;
    defaultValue: any;
    transformer?: (any) => any | null;
  }) {
    this.expirationStore = writable(NaN);
    this.updatingStore = writable(false);
    this.expiresAfter = expiresAfter;
    this.url = url;
    this.store = writable(defaultValue);
    this.name = name;
    this.expireName = `${name}-expires`;
    this.transformer = transformer;
    this.updateFromLocal();
  }

  updateFromLocal() {
    let localValue = localStorage.getItem(this.name);
    if (localValue === null) {
      return;
    } else {
      let value = JSON.parse(localValue);
      this.store.set(value);
      return true;
    }
  }

  updateRemoteIfExpired() {
    this.expiration = Number(localStorage.getItem(this.expireName));
    this.expirationStore.set(this.expiration);
    if (isNaN(this.expiration)) {
      console.log(
        "Error in expiration value?",
        localStorage.getItem(this.expireName),
        "not a number"
      );
      this.expiration = 0;
    }
    if (!this.expiration || this.expiration < new Date().getTime()) {
      console.log(
        `Value of ${this.name} expired ${
          (new Date().getTime() - this.expiration) / 1000
        }s ago, refetch...`
      );
      this.updateFromRemote();
      return true;
    } else {
      console.log(
        `Using local version of ${this.name}, it will not expire for another
        ${(this.expiration - new Date().getTime()) / 1000} seconds
        (at ${new Date(this.expiration)})
        `
      );
    }
  }

  update() {
    let updated = this.updateFromLocal();
    this.updateRemoteIfExpired();
  }

  storeLocalValue(value) {
    let stringValue = JSON.stringify(value);
    localStorage.setItem(this.name, stringValue);
    let time = new Date().getTime();
    this.expiration = time + this.expiresAfter;
    this.expirationStore.set(this.expiration);
    console.log("Setting expiration", new Date(this.expiration));
    localStorage.setItem(this.expireName, `${this.expiration}`);
  }

  async updateFromRemote() {
    this.updatingStore.set(true);
    try {
      let request = await fetch(this.url, { redirect: "follow" });
      let value = await request.json();
      console.log("Got JSON", value, "from", this.url);
      if (this.transformer) {
        value = this.transformer(value);
        console.log("Transformed value to:", value);
      }
      this.storeLocalValue(value);
      this.store.set(value);
      this.updatingStore.set(false);
      return true;
    } catch (err) {
      console.log("Error fetching", this.url);
      console.log(err);
      console.log(":(");
      this.updatingStore.set(false);
      return false;
    }
  }
}
