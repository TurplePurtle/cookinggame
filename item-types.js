import {Action, ItemType} from './classes.js';

export const chickenPotato = new ItemType(
  'chicken with potato',
  'chickenPotato.png',
  true,
);

export const chicken = new ItemType('chicken', 'chicken.png', true);

export const chickenBurnt = new ItemType(
  'burnt chicken',
  'chickenBurnt.png',
  false,
);

export const chickenDoneCooking = new ItemType(
  'cooking done chicken',
  'chickenDoneCooking.png',
  true,
  new Action([[chicken, 1]]),
  new Action([[chickenBurnt, 1]]),
  5000,
);

export const chickenCooking = new ItemType(
  'cooking chicken',
  'chickenCooking.png',
  true,
  undefined,
  new Action([[chickenDoneCooking, 1]]),
  3000,
);

export const chickenRaw = new ItemType(
  'raw chicken',
  'chickenRaw.png',
  false,
  new Action([[chickenCooking, 1]]),
);

export const potato = new ItemType(
  'potatoes',
  'potato.png',
  false,
  new Action([
    [chicken, -1],
    [chickenPotato, 1],
  ]),
);
