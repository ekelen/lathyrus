import { ROOM_TYPES } from "./constants";

export const ROOM_POSITIONS = [
  ["0_C", "rabbit", "10_M", "13_LAB", "9_C"],
  ["1_C", "14_LAB", null, null, "12_M_RABBIT"],
  [null, "5_M_TOAD", "2_M", "11_C", null],
  [null, "4_C", null, null, null],
  [null, "3_LAB", "toad", "exitGoblin", "7_EXIT"],
];

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
    value: 2,
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
    value: 2,
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
];

export const BASE_ROOMS_LIST = [
  {
    id: "0_C",
    name: "Room 0",
    type: ROOM_TYPES.container,
  },
  {
    id: "1_C",
    name: "Room 1",
    type: ROOM_TYPES.container,
  },
  { id: "2_M", name: "Room 2", type: ROOM_TYPES.monster },
  {
    id: "3_LAB",
    name: "Room 3",
    type: ROOM_TYPES.lab,
  },
  {
    id: "4_C",
    name: "Room 4",
    type: ROOM_TYPES.container,
  },
  { id: "5_M_TOAD", name: "Room 5", type: ROOM_TYPES.monster },
  {
    id: "toad",
    name: "Room 6",
    type: ROOM_TYPES.captive,
  },
  {
    id: "7_EXIT",
    name: "Room 7",
    type: ROOM_TYPES.exit,
  },
  {
    id: "exitGoblin",
    name: "Room 8",
    type: ROOM_TYPES.monster,
  },
  {
    id: "9_C",
    name: "Room 9",
    type: ROOM_TYPES.container,
  },
  { id: "10_M", name: "Room 10", type: ROOM_TYPES.monster },
  {
    id: "11_C",
    name: "Room 11",
    type: ROOM_TYPES.container,
  },
  { id: "12_M_RABBIT", name: "Room 12", type: ROOM_TYPES.monster },
  { id: "rabbit", name: "Room 13", type: ROOM_TYPES.captive },
  { id: "13_LAB", name: "Lab 3", type: ROOM_TYPES.lab },
  { id: "14_LAB", name: "Lab 2", type: ROOM_TYPES.lab },
];

export const CONTAINER_ITEMS = {
  "0_C": {
    copper: 1,
    frostEssence: 1,
  },
  "1_C": {
    gold: 2,
    copper: 3,
    frostEssence: 3,
  },
  "4_C": {
    silver: 3,
    earthEssence: 3,
  },
  "9_C": {
    silver: 2,
    copper: 3,
    frostEssence: 3,
  },
  "11_C": {
    gold: 1,
    frostEssence: 4,
    silver: 2,
    copper: 2,
  },
};

export const BASE_MONSTER_LIST = [
  {
    name: "small goblin",
    maxHunger: 4,
    roomId: "2_M",
    image: "goblin",
  },
  {
    name: "zombie",
    maxHunger: 32,
    roomId: "5_M_TOAD",
    image: "zombie",
    hasKeyTo: "toad",
  },
  {
    name: "small goblin",
    maxHunger: 4,
    roomId: "10_M",
    image: "goblin",
  },
  {
    name: "frost goblin",
    maxHunger: 8,
    roomId: "12_M_RABBIT",
    hasKeyTo: "rabbit",
    image: "goblin",
  },
  {
    name: "dragon",
    maxHunger: 64,
    roomId: "exitGoblin",
    image: "dragon",
  },
];

export const BASE_CAPTIVE_LIST = [
  {
    id: "rabbit",
    name: "Rabbit",
    roomId: "rabbit",
    image: "rabbit",
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
    colorClass: "text-pink-600",
    teaches: {
      recipeId: "gildedGroat",
    },
  },
];
