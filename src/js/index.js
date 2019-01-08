// import * as Linear from './linear';
// import * as LSTM from './lstm';
import * as BrainLSTMTimeStep from './brainLSTMTimeStep';

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

const HISTORY = [];
let MODEL = null;
let AGENT_ATTACK = -1;

// const ROCK_EMOJI = '💎';
// const PAPER_EMOJI = '📰';
// const SCISSORS_EMOJI = '✂';
const SMILEY_EMOJI = '🙂';
const NEUTRAL_EMOJI = '⭕';
const ROBOT_EMOJI = '🤖';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Although Brain.js isn't async, future Tensorflow stuff will be. So make the function async.
const updateModel = async (history) => {
  const model = BrainLSTMTimeStep.train(MODEL, history);
  MODEL = model;
  return model;
};

// Although Brain.js isn't async, future Tensorflow stuff might be. So make the function async.
const predict = async (model, history) => {
  const prediction = BrainLSTMTimeStep.run(model, history);
  return prediction;
};

const updateAgentCardWithThinking = () => {
  const p = document.querySelector('#agent p');

  const span = p.querySelector('span');
  span.innerHTML = 'Thinking...';

  const i = p.querySelector('i');
  i.classList = '';
};

const updateAgentCardWithReady = () => {
  const span = document.querySelector('#agent p span');
  span.innerHTML = 'Ready.';
};

const updateAgentCardWithAttack = (attack) => {
  let newClass;
  if (attack === ROCK) newClass = 'fa-hand-rock';
  else if (attack === PAPER) newClass = 'fa-hand-paper';
  else newClass = 'fa-hand-scissors';

  const p = document.querySelector('#agent p');
  const span = p.querySelector('span');
  span.innerHTML = '';

  const i = document.querySelector('#agent p i');
  i.classList = `far ${newClass}`;
};

const updatePlayerCardWithWaiting = () => {
  const playerDiv = document.querySelector('#player');

  // Show buttons
  const buttons = playerDiv.querySelectorAll('button');
  buttons.forEach((button) => {
    button.setAttribute('hidden', null);
  });

  // Hide selection
  const p = playerDiv.querySelector('p');
  p.setAttribute('hidden', null);
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

  // Set new class and show selection
  let newClass;
  if (attack === ROCK) newClass = 'fa-hand-rock';
  else if (attack === PAPER) newClass = 'fa-hand-paper';
  else newClass = 'fa-hand-scissors';

  const p = playerDiv.querySelector('p');
  const i = p.querySelector('i');
  i.classList = `far ${newClass}`;
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
  let emoji = NEUTRAL_EMOJI;
  if (winner === 'player') {
    emoji = SMILEY_EMOJI;
  } else if (winner === 'agent') {
    emoji = ROBOT_EMOJI;
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
  const playerAttack = parseInt(event.target.value);

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
  let waitDuration = 300;
  await sleep(waitDuration);

  //
  // Next Round starting
  //

  // Update player UI so the UX is a little nicer
  updatePlayerCardWithWaiting();

  // Update agent UI to signal that the agent is thinking
  updateAgentCardWithThinking();

  // Update the model and select attack
  // TODO: Can I try to do this processing during the earlier `sleep`?
  const start = new Date();
  const model = await updateModel(HISTORY);
  await pickAgentAttack(model, HISTORY);
  const duration = new Date() - start;
  console.log(duration);

  // Wait some time so the `thinking...` status is readable
  waitDuration = 200 - duration;
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

  if (HISTORY.length === 0) {
    // TODO: Since we have no history, randomly select ROCK, PAPER, or SCISSORS.
    // For now, hardcode choice.
    AGENT_ATTACK = PAPER;
  } else {
    // TODO: Load model from cookie

    // Update the model and pick the agent's attack
    const model = await updateModel(HISTORY);
    await pickAgentAttack(model, HISTORY);
  }

  // Update player and/or agent UI to signal that the agent is ready and the player must
  // pick his next action.
  updateAgentCardWithReady();
  updatePlayerCardWithOptions();
};

//
// Event listeners trigger the above function
//

// When DOM is loaded
document.addEventListener('DOMContentLoaded', onDomContentLoaded);

// Attack button events
const playerAttackButtons = document.querySelectorAll('#player button');
playerAttackButtons.forEach((button) => {
  button.addEventListener('click', onPlayerPicksAttack);
});
