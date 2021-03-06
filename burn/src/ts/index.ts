import * as Parser from 'rss-parser';
import * as Boba from '@benwiz/boba.js';

const parser = new Parser(); // should this be global?

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
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'; // TODO: Note why I'm doing this
  const feed = await parser.parseURL(CORS_PROXY + url);
  return feed;
};

const updateSummary = (status: string): void => {
  const title: Element = document.querySelector('#summary-title');
  const icon: Element = document.querySelector('#summary-icon');
  title.textContent = status;
  if (status === 'No Alert') {
    icon.classList.add('burn', 'fa-fire');
    icon.classList.remove('fa-ban');
  } else {
    icon.classList.add('fa-ban');
    icon.classList.remove('fa-fire');
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
  const northernIcon: HTMLElement = document.querySelector(`#${dayID} #northern i`);
  const southernIcon: HTMLElement = document.querySelector(`#${dayID} #southern i`);
  const coastalIcon: HTMLElement = document.querySelector(`#${dayID} #coastal i`);
  if (northernStatus === 'Burn') {
    northernIcon.classList.add('burn', 'fa-fire');
  } else {
    northernIcon.classList.add('fa-ban');
  }
  if (southernStatus === 'Burn') {
    southernIcon.classList.add('burn', 'fa-fire');
  } else {
    southernIcon.classList.add('fa-ban');
  }
  if (coastalStatus === 'Burn') {
    coastalIcon.classList.add('burn', 'fa-fire');
  } else {
    coastalIcon.classList.add('fa-ban');
  }

  // Get and set aqi values
  const northernAQIElement: HTMLElement = document.querySelector(
    `#${dayID} #northern .aqi .aqi-value`,
  );
  const southernAQIElement: HTMLElement = document.querySelector(
    `#${dayID} #southern .aqi .aqi-value`,
  );
  const coastalAQIElement: HTMLElement = document.querySelector(
    `#${dayID} #coastal .aqi .aqi-value`,
  );
  northernAQIElement.textContent = northernAQI;
  southernAQIElement.textContent = southernAQI;
  coastalAQIElement.textContent = coastalAQI;

  // Make elements visible
  title.style.visibility = 'visible';
  const table: HTMLElement = document.querySelector(`#${dayID}`);
  table.style.visibility = 'visible';
};

const setupBoba = (status: String) => {
  const red = {r: 255, g: 56, b: 96};
  const gray = {r: 192, g: 192, b: 192};

  // Initialize boba.js options by grabbing the defaults
  const bobaOptions = Boba.getDefaultOptions();

  // Canvas configs
  bobaOptions.x = 0;
  bobaOptions.y = 0;
  bobaOptions.width = document.documentElement.scrollWidth;
  bobaOptions.height = document.documentElement.scrollHeight;

  // Vertex configs
  bobaOptions.numVertices = 40;
  bobaOptions.drawVertices = true;
  bobaOptions.vertexMinSize = 8;
  bobaOptions.vertexMaxSize = 16;
  bobaOptions.vertexMinSpeed = 0.5;
  bobaOptions.vertexMaxSpeed = 2;
  bobaOptions.vertexColors = [{...red, a: 0.04}];

  // Edge configs
  bobaOptions.numNeighbors = 2;
  bobaOptions.drawEdges = true;
  bobaOptions.edgeColors = [{...red, a: 0.04}];

  // Shape configs
  bobaOptions.drawShapes = true;
  bobaOptions.shapeColors = [{...red, a: 0.025}];

  // Status
  if (status !== 'No Alert') {
    bobaOptions.vertexColors = [{...gray, a: 0.16,}];
    bobaOptions.edgeColors   = [{...gray, a: 0.00,}];
    bobaOptions.shapeColors  = [{...gray, a: 0.00,}];
  }

  // Start the animation
  Boba.start(bobaOptions);
};

const main = async (): Promise<void> => {
  const spareTheAirRSS: string = 'http://www.baaqmd.gov/Feeds/AlertRSS.aspx';
  const openBurnRSS: string = 'http://www.baaqmd.gov/Feeds/OpenBurnRSS.aspx';
  const aqiRSS: string = 'http://www.baaqmd.gov/Feeds/AirForecastRSS.aspx';

  // Setup Boba as early as possible so the user has something to look at
  setupBoba('fake alert');

  // Read rss feeds
  const [spareTheAir, openBurn, aqi] = await Promise.all([readRSSFeed(spareTheAirRSS),
                                                          readRSSFeed(openBurnRSS),
                                                          readRSSFeed(aqiRSS)]);
  console.log(spareTheAirRSS, spareTheAir);
  console.log(openBurnRSS, openBurn);
  console.log(aqiRSS, aqi);

  // Update summary
  const summaryStatus: string = spareTheAir.items[0].content;
  updateSummary(summaryStatus);

  // Restart Boba.js if there is no alert (not perfect but it works)
  if (summaryStatus === 'No Alert') {
    Boba.stop();
    setupBoba(summaryStatus);
  };

  // Update today
  const today: string = openBurn.items[0].title
    .split('Spare the Air Status for ')[1]
    .split(',')[0];
  const todayOpenBurnStatuses: string = openBurn.items[0].content;
  const todayAQIs: string = aqi.items[0].content;
  updateDetails('today', today, todayOpenBurnStatuses, todayAQIs);

  // Update tomorrow
  const tomorrow: string = openBurn.items[1].title
    .split('Spare the Air Status for ')[1]
    .split(',')[0];
  const tomorrowOpenBurnStatuses: string = openBurn.items[1].content;
  const tomorrowAQIs: string = aqi.items[1].content;
  updateDetails('tomorrow', tomorrow, tomorrowOpenBurnStatuses, tomorrowAQIs);
};

main();
