import { ROOM_TYPES } from "../constants";

const LEVEL_ROOM_POSITIONS = [
  ["0_C", "rabbit", "10_M", "13_LAB", "9_C"],
  ["1_C", "14_LAB", null, null, "12_M_RABBIT"],
  [null, "5_M_TOAD", "2_M", "11_C", null],
  [null, "4_C", null, null, null],
  [null, "3_LAB", "toad", "exitGoblin", "7_EXIT"],
];

const LEVEL_BASE_ROOMS_LIST = [
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

const LEVEL_CONTAINER_ITEMS = {
  "0_C": {
    copper: 3,
    frostEssence: 1,
  },
  "1_C": {
    gold: 2,
    copper: 4,
    frostEssence: 2,
  },
  "4_C": {
    silver: 3,
    earthEssence: 3,
  },
  "9_C": {
    copper: 4,
    frostEssence: 2,
  },
  "11_C": {
    gold: 1,
    earthEssence: 4,
    silver: 2,
    copper: 2,
  },
};

const LEVEL_BASE_MONSTER_LIST = [
  {
    name: "small goblin",
    maxHunger: 4,
    roomId: "2_M",
    image: "goblin",
    minimumItemValueAccepted: 2,
  },
  {
    name: "zombie",
    maxHunger: 32,
    roomId: "5_M_TOAD",
    image: "zombie",
    hasKeyTo: "toad",
    minimumItemValueAccepted: 8,
  },
  {
    name: "small goblin",
    maxHunger: 4,
    roomId: "10_M",
    image: "goblin",
    minimumItemValueAccepted: 2,
  },
  {
    name: "frost goblin",
    maxHunger: 8,
    roomId: "12_M_RABBIT",
    hasKeyTo: "rabbit",
    image: "goblin",
    minimumItemValueAccepted: 2,
  },
  {
    name: "dragon",
    maxHunger: 64,
    roomId: "exitGoblin",
    image: "dragon",
    minimumItemValueAccepted: 16,
  },
];

const LEVEL_EXITS_BY_ROOM_ID = {
  "7_EXIT": {
    exitToLevelId: "level01",
    exitToCoordinates: { x: 4, y: 0 },
    exitToRoomId: "ent",
  },
};

const START_ROOM_ID = "0_C";

const LEVEL_COLOR = "bg-teal-900";

export {
  LEVEL_ROOM_POSITIONS,
  LEVEL_BASE_ROOMS_LIST,
  LEVEL_CONTAINER_ITEMS,
  LEVEL_BASE_MONSTER_LIST,
  LEVEL_EXITS_BY_ROOM_ID,
  START_ROOM_ID,
  LEVEL_COLOR,
};
