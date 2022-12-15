import _ from "lodash";
import { desaturate } from "polished";
import { lighten } from "polished";
import { getPositionFromCoordinates } from "./util";

const ROOM_TYPES = {
  container: "container",
  monster: "monster",
  lab: "lab",
  storage: "storage",
  captive: "captive",
  empty: "empty",
};
const ROOM_POSITIONS = [
  ["0_C", null, "13_RABBIT", null, null],
  ["1_LAB", "2_M", "18", "12_M_RABBIT", null],
  [null, "3_MY_STUFF", null, "10_M", "11_C"],
  [null, "4_C", null, "9_C", null],
  [null, "5_M_TOAD", "6_TOAD", "8_C", "7_C"],
];

const MAP_SIZE = ROOM_POSITIONS.length;
const ROOM_SIZE = 3;

const DIRECTION_OPPOSITE = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

let ROOMS = _.keyBy(
  [
    {
      id: "0_C",
      name: "Room 0",
      type: ROOM_TYPES.container,
      containerName: "fancy chest",
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
      containerName: "canvas sack",
    },
    { id: "5_M_TOAD", name: "Room 5", type: ROOM_TYPES.monster },
    {
      id: "6_TOAD",
      name: "Room 6",
      type: ROOM_TYPES.captive,
    },
    {
      id: "7_C",
      name: "Room 7",
      type: ROOM_TYPES.container,
      containerName: "small crate",
    },
    {
      id: "8_C",
      name: "Room 8",
      type: ROOM_TYPES.container,
      containerName: "tiny crate",
    },
    {
      id: "9_C",
      name: "Room 9",
      type: ROOM_TYPES.container,
      containerName: "huge box",
    },
    { id: "10_M", name: "Room 10", type: ROOM_TYPES.monster },
    {
      id: "11_C",
      name: "Room 11",
      type: ROOM_TYPES.container,
      containerName: "small box",
    },
    { id: "12_M_RABBIT", name: "Room 12", type: ROOM_TYPES.monster },
    { id: "13_RABBIT", name: "Room 13", type: ROOM_TYPES.captive },
    { id: "18", name: "Room 18" },
  ],
  "id"
);

const CONTAINER_ITEMS = {
  "0_C": [
    {
      itemId: "tin",
      quantity: 3,
    },
    {
      itemId: "silver",
      quantity: 3,
    },
    {
      itemId: "frostEssence",
      quantity: 3,
    },
    {
      itemId: "earthEssence",
      quantity: 3,
    },
  ],
  "4_C": [
    {
      itemId: "silver",
      quantity: 3,
    },
  ],
  "7_C": [
    {
      itemId: "rock",
      quantity: 3,
    },
  ],
  "8_C": [
    {
      itemId: "rock",
      quantity: 3,
    },
  ],
  "9_C": [
    {
      itemId: "stick",
      quantity: 3,
    },
    {
      itemId: "diamond",
      quantity: 3,
    },
  ],
  "11_C": [],
};

const MONSTERS = [
  {
    name: "small goblin",
    maxHunger: 3,
    roomId: "2_M",
    image: "goblin",
  },
  {
    name: "largish goblin",
    maxHunger: 5,
    roomId: "5_M_TOAD",
    image: "goblin",
    hasKeyTo: "toad",
  },
  {
    name: "small goblin",
    maxHunger: 3,
    roomId: "10_M",
    image: "goblin",
  },
  {
    name: "frost goblin",
    maxHunger: 3,
    roomId: "12_M_RABBIT",
    hasKeyTo: "rabbit",
    image: "goblin",
  },
];

const ITEMS = _.keyBy(
  [
    { id: "gold", name: "gold", value: 1 },
    { id: "silver", name: "silver", value: 1 },
    { id: "stick", name: "stick", value: 1 },
    { id: "rock", name: "rock", value: 1 },
    { id: "diamond", name: "diamond", value: 1 },
    { id: "frostEssence", name: "Frost Essence", value: 1 },
    { id: "tin", name: "tin", value: 1 },
    { id: "frostFarthing", name: "Frost Farthing", value: 10 },
    { id: "earthEssence", name: "Earth Essence", value: 1 },
    { id: "gildedGroat", name: "Gilded Groat", value: 10 },
  ],
  "id"
);

let RECIPES = [
  {
    name: "Frost Farthing",
    id: "frostFarthing",
    learned: false,
    ingredients: [
      { itemId: "frostEssence", quantity: 1 },
      { itemId: "tin", quantity: 1 },
    ],
  },
  {
    name: "Gilded Groat",
    id: "gildedGroat",
    learned: false,
    ingredients: [
      { itemId: "earthEssence", quantity: 1 },
      { itemId: "silver", quantity: 1 },
    ],
  },
];

RECIPES = _.keyBy(RECIPES, "id");

let CAPTIVES = [
  {
    id: "rabbit",
    name: "rabbit",
    roomId: "13_RABBIT",
    image: "rabbit",
    color: `${lighten(0.2, "blue")}`,
    teaches: {
      recipeId: "frostFarthing",
    },
  },
  {
    id: "toad",
    name: "toad",
    roomId: "6_TOAD",
    image: "toad",
    color: `${desaturate(0.5, "cyan")}`,
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

const mapRooms = () => {
  ROOMS = _.mapValues(ROOMS, (room) => {
    if (room.type === ROOM_TYPES.container) {
      room.containerName = room.containerName ?? "container";
    } else if (!room.type) {
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
  ROOMS = _.mapValues(ROOMS, (room) => {
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
};

mapRooms();

CAPTIVES = _.map(CAPTIVES, (captive) => ({
  ...captive,
  freed: false,
  position: ROOMS[captive.roomId].position,
}));

export {
  MAP_SIZE,
  ROOM_SIZE,
  ROOM_POSITIONS,
  DIRECTION_OPPOSITE,
  ROOMS,
  MONSTERS,
  ITEMS,
  CAPTIVES,
  ROOM_EXIT_POSITIONS,
  CONTAINER_ITEMS,
  RECIPES,
  ROOM_TYPES,
};
