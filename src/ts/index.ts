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

const main = async (): Promise<void> => {
  const spareTheAirRSS: string = 'http://www.baaqmd.gov/Feeds/AlertRSS.aspx';
  const openBurnRSS: string = 'http://www.baaqmd.gov/Feeds/OpenBurnRSS.aspx';
  const aqiRSS: string = 'http://www.baaqmd.gov/Feeds/AirForecastRSS.aspx';

  // Update summary
  const spareTheAir: Feed = await readRSSFeed(spareTheAirRSS);
  const summaryStatus = spareTheAir.items[0].content;
  updateSummary(summaryStatus);

  // Update today
  const openBurn: Feed = await readRSSFeed(openBurnRSS);
  const aqi: Feed = await readRSSFeed(aqiRSS);
  // console.log(openBurn.items);
  // console.log(aqi.items);

  // Update tomorrow
};

// Run
main();
