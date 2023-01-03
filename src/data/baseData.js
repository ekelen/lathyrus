export const BASE_RECIPE_LIST = [
  {
    id: "R_00",
    ingredients: [
      { itemId: "frostEssence", quantity: 1 },
      { itemId: "copper", quantity: 1 },
    ],
  },
  {
    id: "R_01",
    ingredients: [
      { itemId: "earthEssence", quantity: 1 },
      { itemId: "silver", quantity: 1 },
    ],
  },
  {
    id: "R_02",
    ingredients: [
      { itemId: "earthEssence", quantity: 2 },
      { itemId: "mercury", quantity: 1 },
    ],
  },
  {
    id: "R_03",
    ingredients: [
      { itemId: "frostEssence", quantity: 2 },
      { itemId: "gold", quantity: 2 },
    ],
  },
];

export const BASE_ITEM_LIST = [
  { id: "gold", value: 2, symbol: "🜚", type: "alchemy" },
  { id: "silver", value: 2, symbol: "🜛", type: "alchemy" },
  { id: "mercury", value: 2, symbol: "☿", type: "alchemy" },
  { id: "copper", value: 2, symbol: "♀", type: "alchemy" },
  {
    id: "frostEssence",
    value: 4,
    symbol: "🜄",
    type: "element",
  },
  {
    id: "R_00",
    value: 16,
    symbol: "🜞",
    type: "coin",
  },
  {
    id: "earthEssence",
    value: 4,
    symbol: "🜁",
    type: "element",
  },
  {
    id: "R_01",
    value: 64,
    symbol: "🝁",
    type: "coin",
  },
  {
    id: "R_02",
    value: 64,
    symbol: "🜭",
    type: "coin",
  },
  {
    id: "R_03",
    value: 128,
    symbol: "🝊",
    type: "coin",
  },
];

export const BASE_CAPTIVE_LIST = [
  {
    id: "rabbit",
    roomId: "rabbit",
    image: "rabbit",
    levelId: "level00",
    colorClass: "text-pink-300",
    teaches: "R_00",
  },
  {
    id: "toad",
    roomId: "toad",
    image: "toad",
    levelId: "level00",
    colorClass: "text-pink-600",
    teaches: "R_01",
  },
  {
    id: "tortoise",
    roomId: "tortoise",
    image: "tortoise",
    levelId: "level01",
    colorClass: "text-pink-400",
    teaches: "R_02",
  },
  {
    id: "cat",
    roomId: "cat",
    image: "cat",
    levelId: "level01",
    colorClass: "text-pink-100",
    teaches: "R_03",
  },
];
