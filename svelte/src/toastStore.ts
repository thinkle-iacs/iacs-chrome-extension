import { writable } from "svelte/store";

// Toast notification stores
export const toastMessage = writable<string>("");
export const showToast = writable<boolean>(false);
export const highlightSettings = writable<boolean>(false);

// Function to show toast notification
export function showSettingsToast(
  message: string = "To unhide items or manage preferences, click the ⚙ Settings button in the top right"
) {
  toastMessage.set(message);
  highlightSettings.set(true);
  showToast.set(true);

  // Auto-hide after 4 seconds
  setTimeout(() => {
    showToast.set(false);
    highlightSettings.set(false);
  }, 4000);
}
