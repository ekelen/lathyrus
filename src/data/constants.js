import _ from "lodash";
import { getPositionFromCoordinates } from "./util";

const ROOM_TYPES = {
  container: "container",
  monster: "monster",
  lab: "lab",
  storage: "storage",
  captive: "captive",
  empty: "empty",
  exit: "exit",
};
const ROOM_POSITIONS = [
  ["0_C", null, "rabbit", null, null],
  ["1_LAB", "2_M", "13", null, "9_C"],
  [null, "3_MY_STUFF", "11_C", "10_M", "14_LAB"],
  ["12_M_RABBIT", "4_C", null, null, null],
  [null, "5_M_TOAD", "toad", "exitGoblin", "7_EXIT"],
];

const MAP_SIZE = ROOM_POSITIONS.length;
const ROOM_SIZE = 3;

const DIRECTION_OPPOSITE = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

let ITEMS_BY_ID = _.keyBy(
  [
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
  ],
  "id"
);

const ambers = [
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

ITEMS_BY_ID = _.mapValues(ITEMS_BY_ID, (item, id) => ({
  ...item,
  colorClass: ambers[Math.log2(item.value)],
}));

let ROOMS_BY_ID = _.keyBy(
  [
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
      id: "3_MY_STUFF",
      name: "Room 3",
      type: ROOM_TYPES.storage,
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
    { id: "13", name: "Room 13" },
    { id: "14_LAB", name: "Lab 2", type: ROOM_TYPES.lab },
  ],
  "id"
);

const CONTAINER_ITEMS = {
  "0_C": [
    {
      id: "gold",
      quantity: 1,
    },
    {
      id: "tin",
      quantity: 1,
    },
    {
      id: "silver",
      quantity: 1,
    },
    {
      id: "frostEssence",
      quantity: 3,
    },
    {
      id: "earthEssence",
      quantity: 3,
    },
  ],
  "4_C": [
    {
      id: "silver",
      quantity: 1,
    },
    {
      id: "earthEssence",
      quantity: 3,
    },
    {
      id: "frostEssence",
      quantity: 5,
    },
  ],
  "9_C": [
    {
      id: "gold",
      quantity: 1,
    },
    {
      id: "earthEssence",
      quantity: 4,
    },
    {
      id: "frostEssence",
      quantity: 4,
    },
    {
      id: "silver",
      quantity: 2,
    },
    {
      id: "tin",
      quantity: 2,
    },
  ],
  "11_C": [
    {
      id: "gold",
      quantity: 1,
    },
  ],
};

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

const ROOM_EXIT_POSITIONS = {
  north: getPositionFromCoordinates(1, 0),
  east: getPositionFromCoordinates(2, 1),
  south: getPositionFromCoordinates(1, 2),
  west: getPositionFromCoordinates(0, 1),
};

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
      _.mapValues(exits, (exit, direction) => {
        return !exit ? null : ROOM_EXIT_POSITIONS[direction];
      })
    )
  );

  return {
    ...room,
    exits,
    exitTilePositions,
    lockedExitTilePositions: [],
    lockedDirections: [],
    centerPosition: getPositionFromCoordinates(1, 1),
  };
});

CAPTIVE_LIST = _.map(CAPTIVE_LIST, (captive) => ({
  ...captive,
  freed: false,
  position: ROOMS_BY_ID[captive.roomId].position,
}));

const MAX_ITEMS = 5;

export {
  CAPTIVE_LIST,
  CONTAINER_ITEMS,
  DIRECTION_OPPOSITE,
  ITEMS_BY_ID,
  MAP_SIZE,
  MAX_ITEMS,
  MONSTER_LIST,
  RECIPES_BY_ID,
  ROOM_EXIT_POSITIONS,
  ROOM_POSITIONS,
  ROOM_SIZE,
  ROOM_TYPES,
  ROOMS_BY_ID,
};
