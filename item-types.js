import {Action, ItemType} from './classes.js';

export const chickenPotato = new ItemType('chicken with potato', true);

export const chicken = new ItemType('chicken', true);

export const chickenBurned = new ItemType('burned chicken', false);

export const chickenDoneCooking = new ItemType(
  'cooking done chicken',
  true,
  new Action([[chicken, 1]]),
  new Action([[chickenBurned, 1]]),
  5000,
);

export const chickenCooking = new ItemType(
  'cooking chicken',
  true,
  undefined,
  new Action([[chickenDoneCooking, 1]]),
  3000,
);

export const chickenRaw = new ItemType(
  'raw chicken',
  false,
  new Action([[chickenCooking, 1]]),
);

export const potato = new ItemType(
  'potatoes',
  false,
  new Action([
    [chicken, -1],
    [chickenPotato, 1],
  ]),
);
