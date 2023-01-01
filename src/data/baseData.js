import { ROOM_TYPES } from "./constants";

export const BASE_RECIPE_LIST = [
  {
    name: "Frost Farthing",
    id: "frostFarthing",
    ingredients: [
      { itemId: "frostEssence", quantity: 1 },
      { itemId: "copper", quantity: 1 },
    ],
  },
  {
    name: "Gilded Groat",
    id: "gildedGroat",
    ingredients: [
      { itemId: "earthEssence", quantity: 1 },
      { itemId: "silver", quantity: 1 },
    ],
  },
  {
    name: "Earth Blood",
    id: "earthBlood",
    ingredients: [
      { itemId: "earthEssence", quantity: 2 },
      { itemId: "mercury", quantity: 1 },
    ],
  },
];

export const BASE_ITEM_LIST = [
  { id: "gold", name: "Gold", value: 2, symbol: "🜚", type: "alchemy" },
  { id: "silver", name: "Silver", value: 2, symbol: "🜛", type: "alchemy" },
  { id: "mercury", name: "Mercury", value: 2, symbol: "☿", type: "alchemy" },
  { id: "copper", name: "Copper", value: 2, symbol: "♀", type: "alchemy" },
  //   { id: "tin", name: "Tin", value: 2, symbol: "♃", type: "alchemy" },
  {
    id: "frostEssence",
    name: "Frost Essence",
    value: 4,
    symbol: "🜄",
    type: "element",
  },
  {
    id: "frostFarthing",
    name: "Frost Farthing",
    value: 16,
    symbol: "🜞",
    type: "coin",
  },
  {
    id: "earthEssence",
    name: "Earth Essence",
    value: 4,
    symbol: "🜁",
    type: "element",
  },
  {
    id: "gildedGroat",
    name: "Gilded Groat",
    value: 64,
    symbol: "🝁",
    type: "coin",
  },
  {
    id: "earthBlood",
    name: "Earth Blood",
    value: 64,
    symbol: "🜭",
    type: "coin",
  },
];

export const BASE_CAPTIVE_LIST = [
  {
    id: "rabbit",
    name: "Rabbit",
    roomId: "rabbit",
    image: "rabbit",
    levelId: "level00",
    colorClass: "text-pink-300",
    teaches: {
      recipeId: "frostFarthing",
    },
  },
  {
    id: "toad",
    name: "Toad",
    roomId: "toad",
    image: "toad",
    levelId: "level00",
    colorClass: "text-pink-600",
    teaches: {
      recipeId: "gildedGroat",
    },
  },
  {
    id: "tortoise",
    name: "tortoise",
    roomId: "tortoise",
    image: "tortoise",
    levelId: "level01",
    colorClass: "text-pink-400",
    teaches: {
      recipeId: "earthBlood",
    },
  },
];
