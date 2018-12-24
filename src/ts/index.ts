import * as Parser from 'rss-parser';

const parser = new Parser(); // should this be global?
const debug: HTMLElement = document.querySelector('#debug1');
debug.innerHTML += 'hi<br>';

interface Item {
  content: string;
  contentSnippet: string;
  title: string;
}

interface Feed {
  description: string;
  items: Item[];
  language: string;
  lastBuildDate: string;
  link: string;
  title: string;
}

const readRSSFeed = async (url: string): Promise<Feed> => {
  debug.innerHTML += `call ${url}<br>`;
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  const feed = await parser.parseURL(CORS_PROXY + url);
  debug.innerHTML += `called ${url}<br>`;
  return feed;
};

const updateSummary = (status: String): void => {
  const title: Element = document.querySelector('#summary-title');
  const icon: Element = document.querySelector('#summary-icon');
  if (status === 'No Alert') {
    title.textContent = 'Feel free to burn';
    icon.classList.add('burn');
  } else {
    title.textContent = 'Do not burn';
    icon.classList.remove('burn');
  }
};

const updateDetails = (
  dayID: string,
  day: string,
  openBurnStatuses: string,
  aqis: string,
): void => {
  /* tslint:disable:no-magic-numbers */

  // TODO: Don't trust these will come in the same order every time
  const openBurnStatusesSplit = openBurnStatuses.split('\r');
  const northernStatus: string = openBurnStatusesSplit[1].split(': ')[1];
  const southernStatus: string = openBurnStatusesSplit[2].split(': ')[1];
  const coastalStatus: string = openBurnStatusesSplit[3].split(': ')[1];

  // TODO: Don't trust these will come in the same order every time
  const aqisplit: string[] = aqis.split('\r');
  const northernAQI: string = aqisplit[1].split(',')[0].split('AQI: ')[1];
  const southernAQI: string = aqisplit[4].split(',')[0].split('AQI: ')[1];
  const coastalAQI: string = aqisplit[2].split(',')[0].split('AQI: ')[1];

  /* tslint:enable:no-magic-numbers */

  // Get and set title
  const title: HTMLElement = document.querySelector(`#${dayID}-title`);
  title.textContent = day;

  // Get and set icon status
  const northernIcon: HTMLElement = document.querySelector(
    `#${dayID} #northern i`,
  );
  const southernIcon: HTMLElement = document.querySelector(
    `#${dayID} #southern i`,
  );
  const coastalIcon: HTMLElement = document.querySelector(
    `#${dayID} #coastal i`,
  );
  if (northernStatus === 'Burn') northernIcon.classList.add('burn');
  if (southernStatus === 'Burn') southernIcon.classList.add('burn');
  if (coastalStatus === 'Burn') coastalIcon.classList.add('burn');

  // Get and set aqi values
  const northernAQIElement: HTMLElement = document.querySelector(
    `#${dayID} #northern .aqi`,
  );
  const southernAQIElement: HTMLElement = document.querySelector(
    `#${dayID} #southern .aqi`,
  );
  const coastalAQIElement: HTMLElement = document.querySelector(
    `#${dayID} #coastal .aqi`,
  );
  northernAQIElement.textContent = northernAQI;
  southernAQIElement.textContent = southernAQI;
  coastalAQIElement.textContent = coastalAQI;

  // Make elements visible
  title.style.visibility = 'visible';
  const table: HTMLElement = document.querySelector(`#${dayID}`);
  table.style.visibility = 'visible';
};

const main = async (): Promise<void> => {
  debug.innerHTML += 'called main<br>';
  const spareTheAirRSS: string = 'http://www.baaqmd.gov/Feeds/AlertRSS.aspx';
  const openBurnRSS: string = 'http://www.baaqmd.gov/Feeds/OpenBurnRSS.aspx';
  const aqiRSS: string = 'http://www.baaqmd.gov/Feeds/AirForecastRSS.aspx';

  // Update summary
  const spareTheAir: Feed = await readRSSFeed(spareTheAirRSS);
  const summaryStatus = spareTheAir.items[0].content;
  updateSummary(summaryStatus);
  debug.innerHTML += 'updated summary<br>';

  // Read openBurn and aqi RSS feeds
  const openBurn: Feed = await readRSSFeed(openBurnRSS);
  const aqi: Feed = await readRSSFeed(aqiRSS);

  // Update today
  const today: string = openBurn.items[0].title
    .split('Spare the Air Status for ')[1]
    .split(',')[0];
  const todayOpenBurnStatuses: string = openBurn.items[0].content;
  const todayAQIs: string = aqi.items[0].content;
  updateDetails('today', today, todayOpenBurnStatuses, todayAQIs);
  debug.innerHTML += 'updated today<br>';

  // Update tomorrow
  const tomorrow: string = openBurn.items[1].title
    .split('Spare the Air Status for ')[1]
    .split(',')[0];
  const tomorrowOpenBurnStatuses: string = openBurn.items[1].content;
  const tomorrowAQIs: string = aqi.items[1].content;
  updateDetails('tomorrow', tomorrow, tomorrowOpenBurnStatuses, tomorrowAQIs);
  debug.innerHTML += 'updated tomorrow<br>';
};

if (location.protocol === 'https:') {
  location.href =
    'http:' + window.location.href.substring(window.location.protocol.length);
} else {
  debug.innerHTML += 'call main now<br>';
  main();
}
