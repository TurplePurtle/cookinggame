import {Action, ItemType} from './classes.js';

export const chickenBurned = new ItemType('burned chicken', false);

export const chickenCut = new ItemType(
  'cut chicken',
  true,
  undefined,
  undefined,
);

export const chickenCooked = new ItemType(
  'cooked chicken',
  true,
  new Action(chickenCut),
  new Action(chickenBurned),
  5000,
);

export const chickenCooking = new ItemType(
  'cooking chicken',
  true,
  undefined,
  new Action(chickenCooked),
  3000,
);

export const chickenRaw = new ItemType(
  'raw chicken',
  false,
  new Action(chickenCooking),
);
