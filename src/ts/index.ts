import * as Parser from 'rss-parser';

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
  const feed = await parser.parseURL(url);
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

const updateDetails = (openBurnStatuses: string, aqis: string): void => {
  /* tslint:disable:no-magic-numbers */

  // TODO: Don't trust these will come in the same order every time
  const openBurnStatusesSplit = openBurnStatuses.split('\r');
  const northernStatus: string = openBurnStatusesSplit[1].split(': ')[1];
  const southernStatus: string = openBurnStatusesSplit[2].split(': ')[1];
  const coastalStatus: string = openBurnStatusesSplit[3].split(': ')[1];

  // TODO: Don't trust these will come in the same order every time
  const aqisplit: string[] = aqis.split('\r');
  const northernAQI: number = +aqisplit[1].split(',')[0].split('AQI: ')[1];
  const southernAQI: number = +aqisplit[4].split(',')[0].split('AQI: ')[1];
  const coastalAQI: number = +aqisplit[2].split(',')[0].split('AQI: ')[1];

  /* tslint:enable:no-magic-numbers */
};

const main = async (): Promise<void> => {
  const spareTheAirRSS: string = 'http://www.baaqmd.gov/Feeds/AlertRSS.aspx';
  const openBurnRSS: string = 'http://www.baaqmd.gov/Feeds/OpenBurnRSS.aspx';
  const aqiRSS: string = 'http://www.baaqmd.gov/Feeds/AirForecastRSS.aspx';

  // Update summary
  const spareTheAir: Feed = await readRSSFeed(spareTheAirRSS);
  const summaryStatus = spareTheAir.items[0].content;
  updateSummary(summaryStatus);

  // Read openBurn and aqi RSS feeds
  const openBurn: Feed = await readRSSFeed(openBurnRSS);
  const aqi: Feed = await readRSSFeed(aqiRSS);

  // Update today
  const todayOpenBurnStatuses: string = openBurn.items[0].content;
  const todayAQIs: string = aqi.items[0].content;
  updateDetails(todayOpenBurnStatuses, todayAQIs);

  // Update tomorrow
};

// Run
main();
