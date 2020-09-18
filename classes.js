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
  static nextId = 1;
  /** @type {Item[]} */
  static items = [];
  /** @type {ItemType[]} */
  static orders = [];

  static getUniqueId() {
    return Item.nextId++;
  }

  /**
   * @param {ItemType} type
   */
  constructor(type) {
    this.id = Item.getUniqueId();
    this.createdAt = Date.now();
    this.type = type;
    this.onclick = () => {
      if (Item.orders.includes(this.type)) {
        removeItem(this, Item.items);
        removeItem(this.type, Item.orders);
      } else if (this.type.tapAction != undefined) {
        this.type.tapAction.execute(this, Item.items);
      }
    };
    this.ontimer = () => {
      this.type.timerAction.execute(this, Item.items);
    }
    // TODO: use global tick timer instead of making one timer per item.
    if (this.type.timerAction != undefined) {
      window.setTimeout(this.ontimer, this.type.time);
    }
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
      if (!removeItem(item, items)) return;
    }
    for (let i = 0; i < this.amount; i++) {
      items.push(this.itemType.create());
    }
  }
}

/**
 * @template T
 * @param {T} item
 * @param {T[]} items
 * @returns {boolean}
 */
function removeItem(item, items) {
  const index = items.indexOf(item);
  if (index >= 0) items.splice(index, 1);
  return index >= 0;
}
