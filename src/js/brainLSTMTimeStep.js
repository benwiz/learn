import * as brain from '../../vendor/brain';

export const run = () => {
  console.log('run');
  const net = new brain.recurrent.LSTMTimeStep();

  const data = [1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3];
  net.train([data]);

  const output = net.run(data);
  console.log(Math.round(output), '\t', output);
};
