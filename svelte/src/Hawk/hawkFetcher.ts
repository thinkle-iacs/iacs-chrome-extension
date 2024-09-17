const cacheKey = "hawkContent";
const cacheDuration = 1000 * 60 * 60 * 2; // Cache for 2 hours
const gasEndpoint =
  "https://script.google.com/macros/s/AKfycbwX8Rhfv67ua0tFMBFqEDcuBH5tgHKsKfSYmbtrFgeJcnpS4K6pmgFwQoUFbUgNAZs3/exec?n=1";

export async function fetchHawkContent() {
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);

  if (cachedData && cachedTimestamp) {
    const age = Date.now() - parseInt(cachedTimestamp);
    if (age < cacheDuration) {
      return { content: cachedData, cached: true };
    }
  }

  try {
    const response = await fetch(gasEndpoint);
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    const data = await response.json();
    const content = data.join("\n");

    localStorage.setItem(cacheKey, content);
    localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());

    return { content, cached: false };
  } catch (err) {
    throw new Error(`Failed to fetch Hawk content: ${err.message}`);
  }
}
