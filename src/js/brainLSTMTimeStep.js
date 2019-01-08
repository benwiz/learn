import * as brain from '../../vendor/brain';

export const train = (data) => {
  const net = new brain.recurrent.LSTMTimeStep();
  net.train([data]);
  return net;
};

export const run = (net, data) => {
  const output = net.run(data);
  const rounded = Math.round(output);
  return rounded;
};
