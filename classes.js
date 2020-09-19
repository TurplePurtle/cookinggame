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

const uniqueId = {
  /** @private */
  _nextId: 1,
  next() {
    return this._nextId++;
  },
};

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

export class GameState {
  /**
   * @param {Item[]} resources
   */
  constructor(resources) {
    /** @type {Item[]} */
    this.resources = resources;
    /** @type {Order[]} */
    this.orders = [];
    /** @type {Item[]} */
    this.items = [];
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
  }
}

/**
 * @template T
 * @param {number} index
 * @param {T[]} array
 */
function removeIndex(index, array) {
  if (index < 0 || index >= array.length) throw Error('Index out of bounds.');
  array.splice(index, 1);
}

/**
 * @template T
 * @param {T} item
 * @param {T[]} array
 * @returns {boolean}
 */
function remove(item, array) {
  const index = array.indexOf(item);
  if (index < 0) return false;
  removeIndex(index, array);
  return true;
}
