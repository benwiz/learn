# burn

Learn TypeScript by creating a simple website to display Spare the Air information in a more consumable format.

## Resources and RSS Feeds

- [Spare the Air](http://www.sparetheair.org/)
- [RSS Feeds](http://www.baaqmd.gov/online-services/rss-feeds)

## Development Notes

To develop, in two shells run the following two NPM scripts

```sh
npm run webpack
```

```sh
npm start
```

To deploy, just push all changes to GitHub.

## Notes

Don't forget about new step to imports: https://webpack.js.org/guides/typescript/#using-third-party-libraries

## To Do

- Use boba.js instead of boba.wasm
- Don't wait for each rss feed to load, load them all synchronously
- Better loading messages or animation

- _index.html_ organization could be improved by using HTML5's `<secion></section>` elments
- I could check today's date, because the RSS feed is sometimes out of day so shows yesterday's data

- Tomorrow's forecast
- 5 Day forecast
