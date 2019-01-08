// import * as Linear from './linear';
// import * as LSTM from './lstm';
import * as BrainLSTMTimeStep from './brainLSTMTimeStep';

const predict = async (history) => {
  // const history = [1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3];
  const prediction = BrainLSTMTimeStep.run(history);
  console.log(prediction);
};
