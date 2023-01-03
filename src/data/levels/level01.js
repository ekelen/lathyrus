import { ROOM_TYPES } from "../constants";

const LEVEL_ROOM_POSITIONS = [
  [null, "01_2M", "finish", null, "ent"],
  ["cat", "01_M_cat", null, null, "01_0C"],
  ["01_3C", "01_1L", "01_4C", null, "01_0M"],
  ["01_M_tortoise", "tortoise", null, null, "01_1C"],
  [null, "01_1M", "01_2C", "01_0E", "01_0L"],
];

const LEVEL_BASE_ROOMS_LIST = [
  {
    id: "ent",
    type: ROOM_TYPES.exit,
  },
  {
    id: "01_0C",
    type: ROOM_TYPES.container,
  },
  {
    id: "01_0M",
    type: ROOM_TYPES.monster,
  },
  {
    id: "01_1M",
    type: ROOM_TYPES.monster,
  },
  {
    id: "01_1C",
    type: ROOM_TYPES.container,
  },
  {
    id: "01_0L",
    type: ROOM_TYPES.lab,
  },
  {
    id: "01_0E",
    type: ROOM_TYPES.empty,
  },
  {
    id: "01_2C",
    type: ROOM_TYPES.container,
  },
  {
    id: "tortoise",
    type: ROOM_TYPES.captive,
  },
  {
    id: "01_M_tortoise",
    type: ROOM_TYPES.monster,
  },
  {
    id: "finish",
    type: ROOM_TYPES.finish,
  },
  {
    id: "01_1L",
    type: ROOM_TYPES.lab,
  },
  {
    id: "01_3C",
    type: ROOM_TYPES.container,
  },
  {
    id: "cat",
    type: ROOM_TYPES.captive,
  },
  {
    id: "01_M_cat",
    type: ROOM_TYPES.monster,
  },
  {
    id: "01_4C",
    type: ROOM_TYPES.container,
  },
  {
    id: "01_2M",
    type: ROOM_TYPES.monster,
  },
];

const LEVEL_CONTAINER_ITEMS = {
  "01_0C": {
    gold: 1,
    earthEssence: 3,
    silver: 3,
  },
  "01_1C": {
    mercury: 1,
    earthEssence: 3,
    frostEssence: 2,
    silver: 3,
  },
  "01_2C": {
    gold: 1,
    earthEssence: 3,
    frostEssence: 3,
    silver: 3,
  },
  "01_3C": {
    gold: 3,
    earthEssence: 3,
    mercury: 3,
  },
  "01_4C": {
    gold: 5,
    earthEssence: 3,
    frostEssence: 6,
    silver: 3,
  },
};

const LEVEL_BASE_MONSTER_LIST = [
  {
    maxHunger: 4,
    roomId: "01_0M",
    image: "goblin",
    minimumItemValueAccepted: 2,
  },
  {
    maxHunger: 16,
    roomId: "01_1M",
    image: "goblin",
    minimumItemValueAccepted: 4,
  },
  {
    maxHunger: 32,
    roomId: "01_M_tortoise",
    image: "zombie",
    minimumItemValueAccepted: 8,
    hasKeyTo: "tortoise",
  },
  {
    maxHunger: 256,
    roomId: "01_M_cat",
    image: "zombie",
    minimumItemValueAccepted: 64,
    hasKeyTo: "cat",
  },
  {
    maxHunger: 512,
    roomId: "01_2M",
    image: "dragon",
    minimumItemValueAccepted: 64,
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
