import {Item, Order, GameState} from './classes.js';
import * as itemTypes from './item-types.js';
import {renderGame} from './rendering.js';

const state = new GameState([
  new Item(itemTypes.chickenRaw),
]);

state.orders.push(
  new Order(itemTypes.chickenCut, 10000),
  new Order(itemTypes.chickenCut, 10000),
);

Item.state = state;

function tick() {
  state.tick();
  renderGame(state, document.body);
}

function loop() {
  tick();
  requestAnimationFrame(loop);
}

loop();
