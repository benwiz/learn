// import * as Linear from './linear';
// import * as LSTM from './lstm';
import * as BrainLSTMTimeStep from './brainLSTMTimeStep';

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;
const HISTORY = [0, 0, 1, 2, 0, 0, 1, 2, 0, 0, 1, 2, 0, 0, 1, 2];
let AGENT_ATTACK = -1;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

const updateAgentCardWithThinking = () => {
  const p = document.querySelector('#agent p');
  p.innerHTML = 'Thinking...';
};

const updateAgentCardWithReady = () => {
  const p = document.querySelector('#agent p');
  p.innerHTML = 'Ready.';
};

const updateAgentCardWithAttack = (attack) => {
  let string;
  if (attack === ROCK) string = 'Rock';
  else if (attack === PAPER) string = 'Paper';
  else string = 'Scissors';

  const p = document.querySelector('#agent p');
  p.innerHTML = string;
};

const updatePlayerCardWithOptions = () => {
  const playerDiv = document.querySelector('#player');

  // Show buttons
  const buttons = playerDiv.querySelectorAll('button');
  buttons.forEach((button) => {
    button.removeAttribute('hidden');
  });

  // Hide selection
  const p = playerDiv.querySelector('p');
  p.setAttribute('hidden', null);
};

const updatePlayerCardWithAttack = (attack) => {
  const playerDiv = document.querySelector('#player');

  // Hide buttons
  const buttons = playerDiv.querySelectorAll('button');
  buttons.forEach((button) => {
    button.setAttribute('hidden', null);
  });

  // Show selection
  const p = playerDiv.querySelector('p');
  let emoji;
  if (attack === ROCK) emoji = '💎';
  else if (attack === PAPER) emoji = '📰';
  else emoji = '✂';
  p.innerHTML = emoji;
  p.removeAttribute('hidden');
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
  if (prediction === ROCK) AGENT_ATTACK = PAPER;
  else if (prediction === PAPER) AGENT_ATTACK = SCISSORS;
  else AGENT_ATTACK = ROCK;
};

//
// Main functions are the following two event handlers
//

const onPlayerPicksAttack = async (event) => {
  const playerAttack = 0; // event.something;

  // Update agent card with its selected attack
  updateAgentCardWithAttack(AGENT_ATTACK);

  // Update player card with selected attack
  updatePlayerCardWithAttack(playerAttack);

  // Record the attack in global HISTORY array
  updateHistory(playerAttack);

  // Identify the winner
  const winner = determineWinner(playerAttack, AGENT_ATTACK);

  // Update the score card UI
  updateScoreCard(winner);

  // Wait some time for the user to read the result of the game.
  // TODO: Allow a click to exit this early.
  let waitDuration = 2000;
  await sleep(waitDuration);

  //
  // Next Round starting
  //

  // Update player and/or agent UI to signal that the agent is thinking
  updateAgentCardWithThinking();

  // Update the model and select attack
  // TODO: Can I try to do this processing during the earlier `sleep`?
  const start = new Date();
  const model = await updateModel(HISTORY);
  await pickAgentAttack(model, HISTORY);
  const duration = new Date() - start;

  // Wait some time so the `thinking...` status is readable
  waitDuration = 2000 - duration;
  await sleep(waitDuration);

  // Update player and/or agent UI to signal that the agent is ready and the player must
  // pick his next action.
  updateAgentCardWithReady();
  updatePlayerCardWithOptions();
};

const onDomContentLoaded = async () => {
  // TODO: Load history from cookie if there is a cookie

  // Update player and/or agent UI to signal that the agent is thinking
  updateAgentCardWithThinking();

  // Update the model and pick the agent's attack
  const model = await updateModel(HISTORY);
  await pickAgentAttack(model, HISTORY);

  // Update player and/or agent UI to signal that the agent is ready and the player must
  // pick his next action.
  updateAgentCardWithReady();
  updatePlayerCardWithOptions();

  onPlayerPicksAttack({});
};

//
// Event listeners trigger the above function
//

// When DOM is loaded
document.addEventListener('DOMContentLoaded', onDomContentLoaded);
