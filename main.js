import {html, render} from 'https://unpkg.com/lit-html?module';
import {styleMap} from 'https://unpkg.com/lit-html@1.3.0/directives/style-map.js?module';

import {Item, ItemType} from './classes.js';
import * as itemTypes from './item-types.js';

/** @type {ItemType[]} */
const orders = [itemTypes.chickenCooked, itemTypes.chickenCooked];

/** @type {Item[]} */
const items = [
  new Item(itemTypes.chickenRaw),
];

Item.items = items;
Item.orders = orders;

/**
 * @param {Item} item
 * @returns {unknown}
 */
function renderItem(item) {
  const style = styleMap({
    fontWeight: item.type.tapAction != null ? 'bold' : '',
  });
  return html`<span @click=${item.onclick} style=${style}>(${item.name})</span>`;
}

function renderRoot() {
  return html`
    <p>Orders: ${orders.join(', ')}</p>
    <div>
      Items:
      ${items.map(renderItem)}
    </div>
  `;
}

function tick() {
  render(renderRoot(), document.body);
}

setInterval(tick, 100);
