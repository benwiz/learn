import * as Brain from '../../vendor/brain';

export const train = (net, data) => {
  if (net) {
    // Do nothing
  } else {
    // Create new network
    net = new Brain.recurrent.LSTMTimeStep();
  }

  const options = {
    // Defaults values --> expected validation
    // iterations: 500, // 20000, // the maximum times to iterate the training data --> number greater than 0
    // errorThresh: 0.01, // 0.005, // the acceptable error percentage from training data --> number between 0 and 1
    // log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
    // logPeriod: 10, // iterations between logging out --> number greater than 0
    // learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
    // momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    // callback: null, // a periodic call back that can be triggered while training --> null or function
    // callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    // timeout: 500, // Infinity // the max number of milliseconds to train for --> number greater than 0
    // timeout appear to not work
  };
  net.train([data], options);
  return net;
};

export const run = (net, data) => {
  const output = net.run(data);
  const rounded = Math.round(output);
  return rounded;
};
