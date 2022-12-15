<script>
  import { onMount } from "svelte";

  import Card from "../Card.svelte";
  import { whimsy } from "../prefs";
  import SnowCanvas from "./SnowCanvas.svelte";

  async function getWeatherData(lat, lon) {
    console.log("Fetching weather...");
    let gridResponse = await fetch(
      `https://api.weather.gov/points/${lat},${lon}`
    );
    let gridJson = await gridResponse.json();
    let forecastURL = gridJson.properties.forecast;
    let forecastResponse = await fetch(forecastURL);
    let forecastJson = await forecastResponse.json();
    //let forecastData = forecastJson.properties.periods[day];
    //return forecastData
    return forecastJson;
  }
  let weatherData = null;

  async function getIACSWeather() {
    weatherData = await getWeatherData(42.67159, -71.42085);
  }

  onMount(getIACSWeather);
  $: console.log(weatherData);
  let snowInForecast = false;

  $: checkForSnow(weatherData);
  let snow = false;
  function checkForSnow(weatherData) {
    if (
      weatherData &&
      weatherData.properties &&
      weatherData.properties.periods
    ) {
      for (let p of weatherData.properties.periods) {
        if (p.detailedForecast.search(/\bsnow\b/)) {
          console.log("Found snow in", p.detailedForecast);
          snow = true;
        }
      }
    }
  }
</script>

{#if $whimsy && snow}
  <SnowCanvas />
{/if}
{#if weatherData}
  <Card double={true}>
    <h2 slot="head">IACS Weather</h2>
    <section slot="body">
      {#if weatherData.properties}
        {#if weatherData.properties.periods}
          {#each weatherData.properties.periods as period}
            {@const start = new Date(period.startTime)}
            {@const end = new Date(period.endTime)}
            <div class="weather" class:day={period.isDaytime}>
              <div class="icon">
                {#if period.icon}<img
                    alt={period.detailedForecast}
                    src={period.icon}
                  />{/if}
              </div>
              <h3>
                {period.name}
                <div class="detail">
                  {start.toLocaleDateString()}
                  {start.toLocaleTimeString()}&ndash; {end.toLocaleDateString()}
                  {end.toLocaleTimeString()}
                </div>
              </h3>

              <div class="temp">
                {period.temperature}{period.temperatureUnit}
              </div>
              <div class="detailed">{period.detailedForecast}</div>
            </div>
          {/each}
        {/if}
      {/if}
    </section>
    <div slot="footer">
      <a
        href="https://forecast.weather.gov/MapClick.php?lat=42.67573500000003&lon=-71.41973999999993#.Y5oequxud1U"
      >
        See National Weather Service Forecast
      </a>
    </div>
  </Card>
{:else}{/if}

<style>
  * {
    box-sizing: border-box;
  }
  .icon,
  .icon img {
    width: calc(2 * var(--icon-size));
    height: calc(2 * var(--icon-size));
    border-radius: var(--tiny);
  }
  section {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    justify-content: start;
  }
  .weather {
    display: grid;
    grid-template-areas:
      "icon name"
      "icon temp"
      "detail detail";
    gap: var(--pad);
    width: var(--card-width-small);
  }
  .temp {
    grid-area: temp;
    font-size: var(--big);
    font-weight: bold;
  }
  .detailed {
    grid-area: detail;
    font-size: var(--small);
  }
  .icon {
    grid-area: icon;
  }
  h3 {
    grid-area: name;
  }
  h4 {
    grid-area: time;
  }
  .weather {
    padding: 1em;
    border-width: 3px;
  }
  .weather.day {
    margin-right: var(--pad);
    margin-bottom: var(--pad);
  }
  h3 {
    position: relative;
  }
  h3 .detail {
    pointer-events: none;
    opacity: 0;
    transition: all 300ms;
    position: absolute;
    top: -40px;
    left: 0px;
    width: var(--card-width);
    padding: 1em;
  }
  h3:hover .detail {
    background-color: var(--light-text);
    color: var(--black);
    font-size: var(--small);
    opacity: 1;
  }
</style>
