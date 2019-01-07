import * as Linear from './linear';
import * as LSTM from './lstm';

const main = async () => {
  console.log('Linear Regression Model');
  Linear.run(12);
};

main();
