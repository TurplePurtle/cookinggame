import {Action, ItemType} from './classes.js';

export const chickenPotato = new ItemType('chicken with potato', true);

export const chicken = new ItemType('chicken', true);

export const chickenBurned = new ItemType('burned chicken', false);

export const chickenDoneCooking = new ItemType(
  'cooking done chicken',
  true,
  new Action(chicken),
  new Action(chickenBurned),
  5000,
);

export const chickenCooking = new ItemType(
  'cooking chicken',
  true,
  undefined,
  new Action(chickenDoneCooking),
  3000,
);

export const chickenRaw = new ItemType(
  'raw chicken',
  false,
  new Action(chickenCooking),
);

export const potato = new ItemType(
  'potatoes',
  false,
  new Action(chickenPotato),
);
