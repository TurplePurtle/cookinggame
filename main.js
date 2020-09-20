import {GameState, Item, Order, OrderMaker} from './classes.js';
import * as itemTypes from './item-types.js';
import {renderGame} from './rendering.js';

const state = new GameState(
  [new Item(itemTypes.chickenRaw), new Item(itemTypes.potato)],
  new OrderMaker([
    new Order(itemTypes.chicken, 10000),
    new Order(itemTypes.chickenPotato, 10000),
    new Order(itemTypes.chicken, 10000),
    new Order(itemTypes.chickenPotato, 10000),
  ]),
  2,
);

// @ts-ignore Debugging
window.state = state;

function tick() {
  state.tick();
  renderGame(state, document.body);
}

function loop() {
  tick();
  requestAnimationFrame(loop);
}

loop();
