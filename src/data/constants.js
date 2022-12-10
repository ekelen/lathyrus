import _ from "lodash";
import { getPositionFromCoordinates } from "./util";

// const ROOM_POSITIONS = [
//   ["0_C", null, "13_RABBIT", null, null, null, null, null],
//   ["1_C", "2_M", "18", "12_M_RABBIT", null, null, null, null],
//   [null, "3_C", "6_C", "10_M", "11_C", null, "23", null],
//   [null, "4_C", null, "9_C", null, null, "22", null],
//   [null, "5_M", null, "8_C", "7_C", null, "28", null],
//   [null, "14", null, null, null, null, "21", null],
//   [null, "15", "16", "17", null, "19", "20", null],
//   [null, "24_C", "25_C", "26_C", "27_C", null, null, null],
// ];
const ROOM_POSITIONS = [
  ["0_C", null, "13_RABBIT", null, null],
  ["1_C", "2_M", "18", "12_M_RABBIT", null],
  [null, "3_MY_STUFF", null, "10_M", "11_C"],
  [null, "4_C", null, "9_C", null],
  [null, "5_M", "6_C", "8_C", "7_C"],
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
      type: "container",
      containerName: "fancy chest",
    },
    {
      id: "1_C",
      name: "Room 1",
      type: "container",
      containerName: "inconspicuous sack",
    },
    { id: "2_M", name: "Room 2", type: "monster" },
    {
      id: "3_MY_STUFF",
      name: "Room 3",
      type: "storage",
    },
    {
      id: "4_C",
      name: "Room 4",
      type: "container",
      containerName: "canvas sack",
    },
    { id: "5_M", name: "Room 5", type: "monster" },
    {
      id: "6_C",
      name: "Room 6",
      type: "container",
      containerName: "large crate",
    },
    {
      id: "7_C",
      name: "Room 7",
      type: "container",
      containerName: "small crate",
    },
    {
      id: "8_C",
      name: "Room 8",
      type: "container",
      containerName: "tiny crate",
    },
    { id: "9_C", name: "Room 9", type: "container", containerName: "huge box" },
    { id: "10_M", name: "Room 10", type: "monster" },
    {
      id: "11_C",
      name: "Room 11",
      type: "container",
      containerName: "small box",
    },
    { id: "12_M_RABBIT", name: "Room 12", type: "monster" },
    { id: "13_RABBIT", name: "Room 13", type: "captive" },
    // { id: "14", name: "Room 14" },
    // { id: "15", name: "Room 15" },
    // { id: "16", name: "Room 16" },
    // { id: "17", name: "Room 17" },
    { id: "18", name: "Room 18" },
    // { id: "19", name: "Room 19" },
    // { id: "20", name: "Room 20" },
    // { id: "21", name: "Room 21" },
    // { id: "22", name: "Room 22" },
    // { id: "23", name: "Room 23" },
    // { id: "24_C", name: "Room 24", type: "container" },
    // { id: "25_C", name: "Room 25", type: "container" },
    // { id: "26_C", name: "Room 26", type: "container" },
    // { id: "27_C", name: "Room 27", type: "container" },
    // { id: "28", name: "Room 28" },
  ],
  "id"
);

const CONTAINER_ITEMS = {
  "0_C": [
    {
      itemId: "stick",
      quantity: 3,
    },
    {
      itemId: "silver",
      quantity: 3,
    },
  ],
  "1_C": [
    {
      itemId: "silver",
      quantity: 1,
    },
    {
      itemId: "gold",
      quantity: 1,
    },
  ],
  "4_C": [
    {
      itemId: "silver",
      quantity: 3,
    },
  ],
  "6_C": [
    {
      itemId: "silver",
      quantity: 3,
    },
    {
      itemId: "rock",
      quantity: 3,
    },
    {
      itemId: "diamond",
      quantity: 1,
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
    // image: "./img/goblin.svg",
    image: "goblin",
  },
  {
    name: "largish goblin",
    maxHunger: 5,
    roomId: "5_M",
    image: "goblin",
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

const ITEMS = [
  { id: "gold", name: "gold", value: 1 },
  { id: "silver", name: "silver", value: 1 },
  { id: "stick", name: "stick", value: 1 },
  { id: "rock", name: "rock", value: 1 },
  { id: "diamond", name: "diamond", value: 1 },
];

let CAPTIVES = [
  {
    id: "rabbit",
    name: "rabbit",
    roomId: "13_RABBIT",
  },
];

CAPTIVES = _.map(CAPTIVES, (captive) => ({
  ...captive,
  freed: false,
  position: ROOMS[captive.roomId].position,
}));

const ROOM_EXIT_POSITIONS = {
  north: getPositionFromCoordinates(1, 0),
  east: getPositionFromCoordinates(2, 1),
  south: getPositionFromCoordinates(1, 2),
  west: getPositionFromCoordinates(0, 1),
};

const mapRooms = () => {
  ROOMS = _.mapValues(ROOMS, (room) => {
    if (room.type === "container") {
      room.containerName = room.containerName ?? "container";
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
};
