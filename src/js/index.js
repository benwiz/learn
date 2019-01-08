// import * as Linear from './linear';
// import * as LSTM from './lstm';
import * as BrainLSTMTimeStep from './brainLSTMTimeStep';

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;
const HISTORY = [0, 0, 1, 2, 0, 0, 1, 2, 0, 0, 1, 2, 0, 0, 1, 2];
let AGENT_ATTACK = -1;

// Although Brain.js isn't async, future Tensorflow stuff will be. So make the function async.
const updateModel = async (history) => {
  const model = BrainLSTMTimeStep.train(history);
  return model;
};

// Although Brain.js isn't async, future Tensorflow stuff might be. So make the function async.
const predict = async (model, history) => {
  const prediction = BrainLSTMTimeStep.run(model, history);
  return prediction;
};

const updatePlayerCard = (attack) => {
  // TODO: Update the player card to show which attack was selected
  console.log('TODO: updatePlayerCard(attack)');
};

const updateHistory = (attack) => {
  HISTORY.push(attack);
  // TODO: add attack to cookie
};

const determineWinner = (playerAttack, agentAttack) => {
  let result;
  if (playerAttack === ROCK && agentAttack === ROCK) result = null;
  else if (playerAttack === ROCK && agentAttack === PAPER) result = 'agent';
  else if (playerAttack === ROCK && agentAttack === SCISSORS) result = 'player';
  else if (playerAttack === PAPER && agentAttack === ROCK) result = 'player';
  else if (playerAttack === PAPER && agentAttack === PAPER) result = null;
  else if (playerAttack === PAPER && agentAttack === SCISSORS) result = 'agent';
  else if (playerAttack === SCISSORS && agentAttack === ROCK) result = 'agent';
  else if (playerAttack === SCISSORS && agentAttack === PAPER) result = 'player';
  else result = null; // SCISSORS and SCISSORS

  return result;
};

const updateScoreCard = (winner) => {
  let emoji = '⭕';
  if (winner === 'player') {
    emoji = '🙂';
  } else if (winner === 'agent') {
    emoji = '🤖';
  }

  const p = document.querySelector('#score p');
  p.innerHTML += emoji;
};

const pickAgentAttack = async (model, history) => {
  const prediction = await predict(model, history);
  AGENT_ATTACK = prediction;
};

//
// Main functions are the following two event handlers
//

const onPlayerPicksAttack = async (event) => {
  const playerAttack = 0; // event.something;

  // Update player card with selected attack
  updatePlayerCard(playerAttack);

  // Record the attack in global HISTORY array
  updateHistory(playerAttack);

  // Identify the winner
  const winner = determineWinner(playerAttack, AGENT_ATTACK);

  // Update the score card UI
  updateScoreCard(winner);

  // Update the model
  const model = await updateModel(HISTORY);

  // Select the next computer attack
  pickAgentAttack(model, HISTORY);
};

const onDomContentLoaded = () => {
  // TODO: Load history from cookie
  pickAgentAttack(HISTORY);
};

//
// Event listeners trigger the above function
//

// When DOM is loaded
document.addEventListener('DOMContentLoaded', onDomContentLoaded);

// TODO: When payer picks attack
