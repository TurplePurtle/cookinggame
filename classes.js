import {assert, count, isEmpty, remove, removeFirst, removeIndex, uniqueId} from './util.js';

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

/** @typedef {[ItemType, number]} Delta */

/**
 * @param {Delta} delta
 * @returns {boolean}
 */
function isAmountNonZero([, amount]) {
  return amount !== 0;
}

export class Action {
  /**
   * @param {Delta[]} deltas
   */
  constructor(deltas) {
    assert(deltas.every(isAmountNonZero));
    this.deltas = deltas;
  }

  /**
   * @param {Item} item
   * @param {Item[]} items
   * @returns {boolean}
   */
  execute(item, items) {
    const meetRequirements = this.deltas.every(([itemType, amount]) => {
      if (amount >= 0) return true;
      return count(items, i => i.type === itemType) >= -amount;
    });
    if (!meetRequirements) return false;
    if (item.type.isConsumable) {
      if (!remove(item, items)) return false;
    }
    for (const [itemType, amount] of this.deltas) {
      if (amount < 0) {
        for (let i = 0; i < -amount; i++) {
          assert(removeFirst(items, item => item.type === itemType));
        }
      } else if (amount > 0) {
        for (let i = 0; i < amount; i++) {
          items.push(new Item(itemType));
        }
      }
    }
    return true;
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
   * @param {number} goal
   */
  constructor(resources, orderMaker, goal) {
    this.resources = resources;
    this.orderMaker = orderMaker;
    this.goal = goal;
    /** @type {Order[]} */
    this.orders = [];
    /** @type {Order[]} */
    this.queuedOrders = [];
    /** @type {Item[]} */
    this.items = [];
    this.maxOrders = 2;
    this.orderDelay = 2000;
  }

  isFinished() {
    return (
      this.orderMaker.done && isEmpty(this.orders) && isEmpty(this.queuedOrders)
    );
  }

  tick() {
    const now = Date.now();
    for (const item of this.items) {
      if (item.getAge() > item.type.time) {
        this.onItemTimer(item);
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
    while (
      !this.orderMaker.done &&
      this.orders.length + this.queuedOrders.length < this.maxOrders
    ) {
      const order = this.orderMaker.next();
      order.createdAt = now;
      this.queuedOrders.push(order);
    }
  }

  /**
   * @param {Item} item
   */
  onItemTap(item) {
    const orderIndex = this.orders.findIndex(order =>
      order.contains(item.type),
    );
    if (orderIndex >= 0) {
      remove(item, this.items);
      removeIndex(orderIndex, this.orders);
    } else if (item.type.tapAction != undefined) {
      item.type.tapAction.execute(item, this.items);
    }
  }

  /**
   * @param {Item} item
   */
  onItemTimer(item) {
    item.type.timerAction?.execute(item, this.items);
  }
}
