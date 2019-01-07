import * as brain from '../../vendor/brain';

export const run = (data) => {
  const net = new brain.recurrent.LSTMTimeStep();
  net.train([data]);
  const output = net.run(data);
  const rounded = Math.round(output);
  return rounded;
};
