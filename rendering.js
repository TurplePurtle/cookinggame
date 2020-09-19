import {html, render} from 'https://unpkg.com/lit-html@1.3.0?module';
import {styleMap} from 'https://unpkg.com/lit-html@1.3.0/directives/style-map.js?module';
import {Item, Order, GameState} from './classes.js';

/**
 * @param {Item} item
 * @returns {unknown}
 */
function renderItem(item) {
  const style = styleMap({
    fontWeight: item.type.tapAction != null ? 'bold' : '',
  });
  const timer = item.type.timerAction
    ? ` ${Math.ceil((item.type.time - item.getAge()) / 1000)}`
    : '';
  return html`<span @mousedown=${item.onclick} style=${style}
    >(${item.name}${timer})</span
  >`;
}

/**
 * @param {Order} order
 * @returns {unknown}
 */
function renderOrder(order) {
  const timer = Math.ceil((order.time - (Date.now() - order.createdAt)) / 1000);
  return html`<span>(${order.type.name} ${timer})</span>`;
}

/**
 * @param {GameState} state
 * @returns {unknown}
 */
function renderRoot({orders, items, resources}) {
  return html`
    <p>Orders: ${orders.map(renderOrder)}</p>
    <p>Items: ${items.map(renderItem)}</p>
    <p>Resources: ${resources.map(renderItem)}</p>
  `;
}

/**
 * @param {GameState} state
 * @param {HTMLElement} container
 */
export function renderGame(state, container) {
  render(renderRoot(state), container);
}
