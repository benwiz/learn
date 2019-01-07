// import * as Linear from './linear';
// import * as LSTM from './lstm';
import * as BrainLSTMTimeStep from './brainLSTMTimeStep';

const main = async () => {
  const history = [1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3];

  // console.log('Using tensorflow.js linear regression model');
  // Linear.run(12);

  console.log('Using brain.js LSTMTimeStep');
  BrainLSTMTimeStep.run(history);
};

main();
