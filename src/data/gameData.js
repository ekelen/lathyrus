import _ from "lodash";
import { ROOM_TYPES } from "./constants";
import { getPositionFromCoordinates, ROOM_EXIT_POSITIONS } from "./util";

const MAX_ITEMS = 5;

const ROOM_POSITIONS = [
  ["0_C", null, "rabbit", null, null],
  ["1_LAB", "2_M", "13_LAB", null, "9_C"],
  [null, "3_EMPTY", "11_C", "10_M", "14_LAB"],
  ["12_M_RABBIT", "4_C", null, null, null],
  [null, "5_M_TOAD", "toad", "exitGoblin", "7_EXIT"],
];

const MAP_SIZE = ROOM_POSITIONS.length;

const BASE_ITEM_LIST = [
  { id: "gold", name: "Gold", value: 2, symbol: "🜚", type: "alchemy" },
  { id: "silver", name: "Silver", value: 2, symbol: "🜛", type: "alchemy" },
  { id: "mercury", name: "Mercury", value: 2, symbol: "☿", type: "alchemy" },
  { id: "copper", name: "Copper", value: 2, symbol: "♀", type: "alchemy" },
  { id: "tin", name: "Tin", value: 2, symbol: "♃", type: "alchemy" },
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
    symbol: "🜄",
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
    value: 32,
    symbol: "🜁",
    type: "coin",
  },
];

const ITEM_IDS = BASE_ITEM_LIST.map((item) => item.id);

const itemColorsByValue = [
  "text-amber-100",
  "text-amber-200",
  "text-amber-300",
  "text-amber-400",
  "text-amber-500",
  "text-amber-600",
  "text-amber-700",
  "text-amber-800",
  "text-amber-900",
];

const ITEMS_BY_ID = _.keyBy(
  BASE_ITEM_LIST.map((item) => ({
    ...item,
    quantity: 0,
    colorClass: itemColorsByValue[Math.log2(item.value)],
  })),
  "id"
);

const BASE_ROOMS_LIST = [
  {
    id: "0_C",
    name: "Room 0",
    type: ROOM_TYPES.container,
  },
  {
    id: "1_LAB",
    name: "Room 1",
    type: ROOM_TYPES.lab,
  },
  { id: "2_M", name: "Room 2", type: ROOM_TYPES.monster },
  {
    id: "3_EMPTY",
    name: "Room 3",
    type: ROOM_TYPES.empty,
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

let ROOMS_BY_ID = _.keyBy(BASE_ROOMS_LIST, "id");

const CONTAINER_ITEMS = {
  "0_C": {
    gold: 1,
    tin: 1,
    silver: 1,
    frostEssence: 3,
    earthEssence: 3,
  },

  "4_C": {
    silver: 1,
    earthEssence: 3,
    frostEssence: 5,
  },
  "9_C": {
    gold: 1,
    earthEssence: 4,
    frostEssence: 4,
    silver: 2,
    tin: 2,
  },
  "11_C": {
    gold: 1,
    frostEssence: 4,
    silver: 2,
    tin: 2,
  },
};

const CONTAINER_ROOM_KEYS = _.keys(
  _.pickBy(ROOMS_BY_ID, (room) => room.type === "container")
);

const ITEMS_BY_ROOM_ID = _.zipObject(
  CONTAINER_ROOM_KEYS,
  CONTAINER_ROOM_KEYS.map((roomId) =>
    _.zipObject(
      ITEM_IDS,
      ITEM_IDS.map((itemId) => CONTAINER_ITEMS[roomId][itemId] ?? 0)
    )
  )
);

const MONSTER_LIST = [
  {
    name: "small goblin",
    maxHunger: 4,
    roomId: "2_M",
    image: "goblin",
  },
  {
    name: "largish goblin",
    maxHunger: 8,
    roomId: "5_M_TOAD",
    image: "goblin",
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
    name: "goblin",
    maxHunger: 32,
    roomId: "exitGoblin",
    image: "goblin",
  },
];

let RECIPES_BY_ID = [
  {
    name: "Frost Farthing",
    id: "frostFarthing",
    ingredients: [
      { itemId: "frostEssence", quantity: 1 },
      { itemId: "tin", quantity: 1 },
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

RECIPES_BY_ID = _.keyBy(RECIPES_BY_ID, "id");

let CAPTIVE_LIST = [
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

ROOMS_BY_ID = _.mapValues(ROOMS_BY_ID, (room) => {
  if (!room.type) {
    room.type = ROOM_TYPES.empty;
  }
  const y = ROOM_POSITIONS.findIndex((row) => row.includes(room.id));
  const x = ROOM_POSITIONS[y].findIndex((id) => id === room.id);
  return {
    ...room,
    position: getPositionFromCoordinates(x, y),
    coordinates: { x, y },
  };
});
ROOMS_BY_ID = _.mapValues(ROOMS_BY_ID, (room) => {
  const { x, y } = room.coordinates;
  const exits = {
    north: ROOM_POSITIONS[y - 1]?.[x] ?? null,
    south: ROOM_POSITIONS[y + 1]?.[x] ?? null,
    east: ROOM_POSITIONS[y]?.[x + 1] ?? null,
    west: ROOM_POSITIONS[y]?.[x - 1] ?? null,
  };
  const exitTilePositions = _.compact(
    _.values(
      _.mapValues(exits, (roomId, direction) => {
        return !roomId ? null : ROOM_EXIT_POSITIONS[direction];
      })
    )
  );

  return {
    ...room,
    exits,
    exitTilePositions,
    lockedExitTilePositions: [],
    lockedDirections: [],
  };
});

CAPTIVE_LIST = _.map(CAPTIVE_LIST, (captive) => ({
  ...captive,
  freed: false,
  position: ROOMS_BY_ID[captive.roomId].position,
}));

const MONSTERS_BY_ROOM_ID = _.keyBy(
  MONSTER_LIST.map((monster) => ({
    ...monster,
    hunger: monster.maxHunger,
    sated: false,
  })),
  "roomId"
);

const INVENTORY_BY_ID = _.zipObject(
  ITEM_IDS,
  ITEM_IDS.map(() => 0)
);

const CAPTIVES_BY_ID = _.keyBy(CAPTIVE_LIST, "id");

export {
  CAPTIVE_LIST,
  CAPTIVES_BY_ID,
  CONTAINER_ITEMS,
  ITEMS_BY_ID,
  ITEMS_BY_ROOM_ID,
  ITEM_IDS,
  INVENTORY_BY_ID,
  BASE_ITEM_LIST,
  MAP_SIZE,
  MAX_ITEMS,
  MONSTER_LIST,
  MONSTERS_BY_ROOM_ID,
  RECIPES_BY_ID,
  ROOMS_BY_ID,
  ROOM_POSITIONS,
};
