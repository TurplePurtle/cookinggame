/**
 * @template T
 * @typedef {(x: T) => boolean} Predicate
 */

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
 * @returns {boolean}
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

/**
 * @template T
 * @param {T[]} array
 * @param {Predicate<T>} where
 * @returns {boolean}
 */
export function removeFirst(array, where) {
  const index = array.findIndex(where);
  if (index < 0) return false;
  removeIndex(index, array);
  return true;
}

// /**
//  * @template T
//  * @param {T[]} array
//  * @param {Predicate<T>} where
//  */
// export function removeWhere(array, where) {
//   const newArray = array.filter(where);
//   array.length = newArray.length;
//   for (let i = 0; i < newArray.length; i++) {
//     array[i] = newArray[i];
//   }
// }

/**
 * @template T
 * @param {T[]} array
 * @param {Predicate<T>} where
 */
export function count(array, where) {
  let count = 0;
  for (const item of array) {
    if (where(item)) count++;
  }
  return count;
}
