import {assert, isEmpty, remove, removeIndex, uniqueId} from './util.js';

export class ItemType {
  /**
   * @param {string} name
   * @param {boolean} isConsumable
   * @param {Action} tapAction
   * @param {Action} timerAction
   * @param {number} time
   */
  constructor(
    name,
    isConsumable,
    tapAction = undefined,
    timerAction = undefined,
    time = 0,
  ) {
    this.name = name;
    this.isConsumable = isConsumable;
    this.tapAction = tapAction;
    this.timerAction = timerAction;
    this.time = time;
  }

  /**
   * @returns {Item}
   */
  create() {
    return new Item(this);
  }

  toString() {
    return `[ItemType ${this.name}]`;
  }
}

export class Item {
  /**
   * @param {ItemType} type
   */
  constructor(type) {
    this.id = uniqueId.next();
    this.createdAt = Date.now();
    this.type = type;
    this.onclick = () => {
      const orderIndex = Item.state.orders.findIndex(order =>
        order.contains(this.type),
      );
      if (orderIndex >= 0) {
        remove(this, Item.state.items);
        removeIndex(orderIndex, Item.state.orders);
      } else if (this.type.tapAction != undefined) {
        this.type.tapAction.execute(this, Item.state.items);
      }
    };
    this.ontimer = () => {
      this.type.timerAction?.execute(this, Item.state.items);
    };
  }

  get name() {
    return this.type.name;
  }

  getAge(now = Date.now()) {
    return now - this.createdAt;
  }

  toString() {
    return `[Item ${this.id} ${this.name}]`;
  }
}

/** @type {GameState} */
Item.state;

export class Action {
  /**
   * @param {ItemType} itemType
   * @param {number} amount
   */
  constructor(itemType, amount = 1) {
    this.itemType = itemType;
    this.amount = amount;
  }

  /**
   * @param {Item} item
   * @param {Item[]} items
   */
  execute(item, items) {
    if (item.type.isConsumable) {
      if (!remove(item, items)) return;
    }
    for (let i = 0; i < this.amount; i++) {
      items.push(this.itemType.create());
    }
  }
}

export class Order {
  /**
   * @param {ItemType} type
   * @param {number} time
   */
  constructor(type, time) {
    this.createdAt = Date.now();
    this.time = time;
    this.type = type;
  }

  /**
   * @param {ItemType} type
   */
  contains(type) {
    return this.type === type;
  }
}

export class OrderMaker {
  /**
   * @param {Order[]} orders
   */
  constructor(orders) {
    this.orders = orders;
    this._index = 0;
  }

  get done() {
    return this._index >= this.orders.length;
  }

  next() {
    return this.orders[this._index++];
  }
}

export class GameState {
  /**
   * @param {Item[]} resources
   * @param {OrderMaker} orderMaker
   */
  constructor(resources, orderMaker) {
    this.resources = resources;
    this.orderMaker = orderMaker;
    /** @type {Order[]} */
    this.orders = [];
    /** @type {Order[]} */
    this.queuedOrders = [];
    /** @type {Item[]} */
    this.items = [];
    this.maxOrders = 2;
    this.orderDelay = 2000;
  }

  completed() {
    return this.orderMaker.done && isEmpty(this.orders) && isEmpty(this.queuedOrders);
  }

  tick() {
    const now = Date.now();
    for (const item of this.items) {
      if (item.getAge() > item.type.time) {
        item.ontimer();
      }
    }
    for (const order of this.orders) {
      if (now - order.createdAt > order.time) {
        remove(order, this.orders);
      }
    }
    for (const order of this.queuedOrders) {
      if (now - order.createdAt >= this.orderDelay) {
        assert(remove(order, this.queuedOrders));
        order.createdAt = now;
        this.orders.push(order);
      }
    }
    while (!this.orderMaker.done &&
        this.orders.length + this.queuedOrders.length < this.maxOrders) {
      const order = this.orderMaker.next();
      order.createdAt = now;
      this.queuedOrders.push(order);
    }
  }
}
