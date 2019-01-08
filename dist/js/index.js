/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _brainLSTMTimeStep = __webpack_require__(1);

var BrainLSTMTimeStep = _interopRequireWildcard(_brainLSTMTimeStep);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ROCK = 0; // import * as Linear from './linear';
// import * as LSTM from './lstm';

var PAPER = 1;
var SCISSORS = 2;

var HISTORY = [];
var MODEL = null;
var AGENT_ATTACK = -1;

var ROCK_EMOJI = '💎';
var PAPER_EMOJI = '📰';
var SCISSORS_EMOJI = '✂';
var SMILEY_EMOJI = '🙂';
var NEUTRAL_EMOJI = '⭕';
var ROBOT_EMOJI = '🤖';

var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

// Although Brain.js isn't async, future Tensorflow stuff will be. So make the function async.
var updateModel = async function updateModel(history) {
  var model = BrainLSTMTimeStep.train(MODEL, history);
  MODEL = model;
  return model;
};

// Although Brain.js isn't async, future Tensorflow stuff might be. So make the function async.
var predict = async function predict(model, history) {
  var prediction = BrainLSTMTimeStep.run(model, history);
  return prediction;
};

var updateAgentCardWithThinking = function updateAgentCardWithThinking() {
  var p = document.querySelector('#agent p');
  p.innerHTML = 'Thinking...';
};

var updateAgentCardWithReady = function updateAgentCardWithReady() {
  var p = document.querySelector('#agent p');
  p.innerHTML = 'Ready.';
};

var updateAgentCardWithAttack = function updateAgentCardWithAttack(attack) {
  var string = void 0;
  if (attack === ROCK) string = ROCK_EMOJI;else if (attack === PAPER) string = PAPER_EMOJI;else string = SCISSORS_EMOJI;

  var p = document.querySelector('#agent p');
  p.innerHTML = string;
};

var updatePlayerCardWithWaiting = function updatePlayerCardWithWaiting() {
  var playerDiv = document.querySelector('#player');

  // Show buttons
  var buttons = playerDiv.querySelectorAll('button');
  buttons.forEach(function (button) {
    button.setAttribute('hidden', null);
  });

  // Hide selection
  var p = playerDiv.querySelector('p');
  p.setAttribute('hidden', null);
};

var updatePlayerCardWithOptions = function updatePlayerCardWithOptions() {
  var playerDiv = document.querySelector('#player');

  // Show buttons
  var buttons = playerDiv.querySelectorAll('button');
  buttons.forEach(function (button) {
    button.removeAttribute('hidden');
  });

  // Hide selection
  var p = playerDiv.querySelector('p');
  p.setAttribute('hidden', null);
};

var updatePlayerCardWithAttack = function updatePlayerCardWithAttack(attack) {
  var playerDiv = document.querySelector('#player');

  // Hide buttons
  var buttons = playerDiv.querySelectorAll('button');
  buttons.forEach(function (button) {
    button.setAttribute('hidden', null);
  });

  // Show selection
  var p = playerDiv.querySelector('p');
  var emoji = void 0;
  if (attack === ROCK) emoji = ROCK_EMOJI;else if (attack === PAPER) emoji = PAPER_EMOJI;else emoji = SCISSORS_EMOJI;
  p.innerHTML = emoji;
  p.removeAttribute('hidden');
};

var updateHistory = function updateHistory(attack) {
  HISTORY.push(attack);
  // TODO: add attack to cookie
};

var determineWinner = function determineWinner(playerAttack, agentAttack) {
  var result = void 0;
  if (playerAttack === ROCK && agentAttack === ROCK) result = null;else if (playerAttack === ROCK && agentAttack === PAPER) result = 'agent';else if (playerAttack === ROCK && agentAttack === SCISSORS) result = 'player';else if (playerAttack === PAPER && agentAttack === ROCK) result = 'player';else if (playerAttack === PAPER && agentAttack === PAPER) result = null;else if (playerAttack === PAPER && agentAttack === SCISSORS) result = 'agent';else if (playerAttack === SCISSORS && agentAttack === ROCK) result = 'agent';else if (playerAttack === SCISSORS && agentAttack === PAPER) result = 'player';else result = null; // SCISSORS and SCISSORS

  return result;
};

var updateScoreCard = function updateScoreCard(winner) {
  var emoji = NEUTRAL_EMOJI;
  if (winner === 'player') {
    emoji = SMILEY_EMOJI;
  } else if (winner === 'agent') {
    emoji = ROBOT_EMOJI;
  }

  var p = document.querySelector('#score p');
  p.innerHTML += emoji;
};

var pickAgentAttack = async function pickAgentAttack(model, history) {
  var prediction = await predict(model, history);

  if (prediction === ROCK) AGENT_ATTACK = PAPER;else if (prediction === PAPER) AGENT_ATTACK = SCISSORS;else AGENT_ATTACK = ROCK;
};

//
// Main functions are the following two event handlers
//

var onPlayerPicksAttack = async function onPlayerPicksAttack(event) {
  var playerAttack = parseInt(event.target.value);

  // Update agent card with its selected attack
  updateAgentCardWithAttack(AGENT_ATTACK);

  // Update player card with selected attack
  updatePlayerCardWithAttack(playerAttack);

  // Record the attack in global HISTORY array
  updateHistory(playerAttack);

  // Identify the winner
  var winner = determineWinner(playerAttack, AGENT_ATTACK);

  // Update the score card UI
  updateScoreCard(winner);

  // Wait some time for the user to read the result of the game.
  // TODO: Allow a click to exit this early.
  var waitDuration = 300;
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
  var start = new Date();
  var model = await updateModel(HISTORY);
  await pickAgentAttack(model, HISTORY);
  var duration = new Date() - start;
  console.log(duration);

  // Wait some time so the `thinking...` status is readable
  waitDuration = 200 - duration;
  await sleep(waitDuration);

  // Update player and/or agent UI to signal that the agent is ready and the player must
  // pick his next action.
  updateAgentCardWithReady();
  updatePlayerCardWithOptions();
};

var onDomContentLoaded = async function onDomContentLoaded() {
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
    var model = await updateModel(HISTORY);
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
var playerAttackButtons = document.querySelectorAll('#player button');
playerAttackButtons.forEach(function (button) {
  button.addEventListener('click', onPlayerPicksAttack);
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

"use strict";
throw new Error("Module build failed: SyntaxError: Unexpected token, expected , (23:145)\n\n\u001b[0m \u001b[90m 21 | \u001b[39m  \u001b[90m//   // timeout: 500, // Infinity // the max number of milliseconds to train for --> number greater than 0\u001b[39m\n \u001b[90m 22 | \u001b[39m  \u001b[90m// };\u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 23 | \u001b[39m  net\u001b[33m.\u001b[39mtrain([data]\u001b[33m,\u001b[39m { keepNetworkIntact\u001b[33m:\u001b[39m \u001b[36mtrue\u001b[39m \u001b[90m/* keepNetworkIntact is apparently deprecated */\u001b[39m\u001b[33m,\u001b[39m timeout\u001b[33m:\u001b[39m \u001b[35m500\u001b[39m \u001b[90m/* timeout doesn't appear to work */\u001b[39m)\u001b[33m;\u001b[39m\n \u001b[90m    | \u001b[39m                                                                                                                                                 \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 24 | \u001b[39m  \u001b[36mreturn\u001b[39m net\u001b[33m;\u001b[39m\n \u001b[90m 25 | \u001b[39m}\u001b[33m;\u001b[39m\n \u001b[90m 26 | \u001b[39m\u001b[0m\n");

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map