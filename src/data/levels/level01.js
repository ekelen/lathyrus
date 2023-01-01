import { ROOM_TYPES } from "../constants";

const LEVEL_ROOM_POSITIONS = [
  [null, null, null, null, "ent"],
  [null, null, null, null, "01_0C"],
  [null, "finish", null, null, "01_0M"],
  ["01_M_tortoise", "tortoise", null, null, "01_1C"],
  [null, "01_1M", "01_2C", "01_0E", "01_0L"],
];

const LEVEL_BASE_ROOMS_LIST = [
  {
    id: "ent",
    name: "Portal",
    type: ROOM_TYPES.exit,
  },
  {
    id: "01_0C",
    name: "Room 01",
    type: ROOM_TYPES.container,
  },
  {
    id: "01_0M",
    name: "01_0M",
    type: ROOM_TYPES.monster,
  },
  {
    id: "01_1M",
    name: "01_1M",
    type: ROOM_TYPES.monster,
  },
  {
    id: "01_1C",
    name: "01_1C",
  },
  {
    id: "01_0L",
    name: "01_0L",
    types: ROOM_TYPES.lab,
  },
  {
    id: "01_0E",
    name: "01_0E",
    types: ROOM_TYPES.empty,
  },
  {
    id: "01_2C",
    name: "01_2C",
    type: ROOM_TYPES.container,
  },
  {
    id: "tortoise",
    name: "tortoise",
    type: ROOM_TYPES.captive,
  },
  {
    id: "01_M_tortoise",
    name: "01_M_tortoise",
    type: ROOM_TYPES.monster,
  },
  {
    id: "finish",
    name: "finish",
    type: ROOM_TYPES.finish,
  },
];

const LEVEL_CONTAINER_ITEMS = {
  "01_0C": {
    gold: 1,
    earthEssence: 3,
    silver: 3,
  },
  "01_2C": {
    gold: 1,
    earthEssence: 3,
    silver: 3,
  },
};

const LEVEL_BASE_MONSTER_LIST = [
  {
    name: "small goblin",
    maxHunger: 4,
    roomId: "01_0M",
    image: "goblin",
    minimumItemValueAccepted: 2,
  },
  {
    name: "small goblin",
    maxHunger: 4,
    roomId: "01_1M",
    image: "goblin",
    minimumItemValueAccepted: 2,
  },
  {
    name: "zombie",
    maxHunger: 8,
    roomId: "01_M_tortoise",
    image: "zombie",
    minimumItemValueAccepted: 2,
    hasKeyTo: "tortoise",
  },
];

const LEVEL_EXITS_BY_ROOM_ID = {
  ent: {
    exitToLevelId: "level00",
    exitToCoordinates: { x: 4, y: 4 },
    exitToRoomId: "7_EXIT",
  },
};

const START_ROOM_ID = "ent"; // For when/if restart level

const LEVEL_COLOR = "bg-sky-900";

export {
  LEVEL_BASE_MONSTER_LIST,
  LEVEL_CONTAINER_ITEMS,
  LEVEL_BASE_ROOMS_LIST,
  LEVEL_ROOM_POSITIONS,
  LEVEL_EXITS_BY_ROOM_ID,
  START_ROOM_ID,
  LEVEL_COLOR,
};
