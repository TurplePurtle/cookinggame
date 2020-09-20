/**
 * @param {boolean} cond
 * @param {string} msg
 */
export function assert(cond, msg = 'Assertion failed.') {
  if (!cond) throw Error(msg);
}

export const uniqueId = {
  /** @private */
  _nextId: 1,
  next() {
    return this._nextId++;
  },
};

/**
 * @template T
 * @param {T[]} array
 */
export function isEmpty(array) {
  return array.length === 0;
}

/**
 * @template T
 * @param {number} index
 * @param {T[]} array
 */
export function removeIndex(index, array) {
  if (index < 0 || index >= array.length) throw Error('Index out of bounds.');
  array.splice(index, 1);
}

/**
 * @template T
 * @param {T} item
 * @param {T[]} array
 * @returns {boolean}
 */
export function remove(item, array) {
  const index = array.indexOf(item);
  if (index < 0) return false;
  removeIndex(index, array);
  return true;
}
