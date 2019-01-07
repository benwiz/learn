import * as tf from '@tensorflow/tfjs';

const train = async () => {
  // Training data
  const labels = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
  const X = Array(...{ length: labels.length }).map(Number.call, Number);
  const xs = tf.tensor1d(X);
  const ys = tf.tensor1d(labels);
  xs.print();
  ys.print();

  // Define a model for linear regression.
  const linearModel = tf.sequential();
  linearModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Prepare the model for training: Specify the loss and the optimizer.
  linearModel.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Train
  const epochs = 300;
  console.log('epochs:', epochs);
  await linearModel.fit(xs, ys, { epochs });

  return linearModel;
};

const predict = (linearModel, value) => {
  const output = linearModel.predict(tf.tensor2d([value], [1, 1]));
  const prediction = Array.from(output.dataSync())[0];
  return prediction;
};

const main = async () => {
  // Train
  console.log('train...');
  const linearModel = await train();
  console.log('trained!');

  // Predict
  const value = 12;
  console.log('predict...', value);
  const prediction = predict(linearModel, value);
  console.log('prediction:', prediction);
};

main();
