# rock-paper-scissors-ai

Learn to use Tensorflow.js and Brain.js by predicting next play in rock-paper-scissors.

## Development

Compile js and scss

```sh
npm run webpack
```

Run the local serve

```sh
npm start
```

## Notes

Use a promise to await multiple async functions

```js
// wait for the array of results
let results = await Promise.all([
  fetch(url1),
  fetch(url2),
  ...
]);
```

## To Do

- Can I continue training a brain.js net instead of creating a new one from scratch?

- BUG: Weird first row of table, it's not perfectly 50-50
- Go back and layer in cookie usage

- Try multilayer perceptron
- Try LSTM
- Look into "Maximum Likelihood Estimation"
