# burn

Learn TypeScript by creating a simple website to display Spare the Air information in a more consumable format.

## What I would do differently

- _index.html_ organization could be improved by using HTML5's `<secion></section>` elments
- _tslint.json_ and my VS Code Prettier extension aren't behaving perfectly so the auto-formatting isn't to my exact preferences
- I could check today's date, because the RSS feed is sometimes out of day so shows yesterday's data
- I don't load all RSS feeds concurrently because I haven't used async/await before and didn't take the time to figure it out

## Resources and RSS Feeds

- [Spare the Air](http://www.sparetheair.org/)
- [RSS Feeds](http://www.baaqmd.gov/online-services/rss-feeds)

## Development Notes

To develop in two shells run the following two NPM scripts

```sh
npm run webpack
```

```sh
npm start
```

To deploy just push all changes to GitHub.

## Notes

Don't forget about new step to imports: https://webpack.js.org/guides/typescript/#using-third-party-libraries

## To Do

- Don't wait for each rss feed to load, load them all synchronously
- Better loading messages or animation
- Bug
  - tslint not listening to "no-magic-numbers" or "max-length" properly
  - tslint not liking my imports in index.js even though they are in package.json
