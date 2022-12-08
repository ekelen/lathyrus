import _ from "lodash";

const ROOM_POSITIONS = [
  ["0_C", null, "13", null, null],
  ["1_C", "2_M", null, "12", null],
  [null, "3_C", "6_C", "10_M", "11_C"],
  [null, "4_C", null, "9_C", null],
  [null, "5_M", "7_C", "8_C", null],
];

export const MAP_SIZE = ROOM_POSITIONS.length;
export const ROOM_SIZE = 3;

export const getPositionFromCoordinates = (x, y) => {
  return y * ROOM_SIZE + x;
};

export const getCoordinatesFromPosition = (position) => {
  return {
    x: position % ROOM_SIZE,
    y: Math.floor(position / ROOM_SIZE),
  };
};

export const ROOM_EXIT_POSITIONS = {
  north: getPositionFromCoordinates(1, 0),
  east: getPositionFromCoordinates(2, 1),
  south: getPositionFromCoordinates(1, 2),
  west: getPositionFromCoordinates(0, 1),
};

export const ROOMS = _.keyBy(
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
    { id: "2_M", name: "Room 2", type: "monster", monsterName: "spooky ghost" },
    {
      id: "3_C",
      name: "Room 3",
      type: "container",
      containerName: "small box",
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
    { id: "12", name: "Room 12" },
    { id: "13", name: "Room 13" },
  ],
  "id"
);

const mapRooms = () => {
  _.values(ROOMS).forEach((room) => {
    const y = ROOM_POSITIONS.findIndex((row) => row.includes(room.id));
    const x = ROOM_POSITIONS[y].findIndex((id) => id === room.id);
    ROOMS[room.id].coordinates = { x, y };
  });
  _.values(ROOMS).forEach((room) => {
    const { x, y } = room.coordinates;
    ROOMS[room.id].exits = {
      north: ROOM_POSITIONS[y - 1]?.[x] ?? null,
      south: ROOM_POSITIONS[y + 1]?.[x] ?? null,
      east: ROOM_POSITIONS[y]?.[x + 1] ?? null,
      west: ROOM_POSITIONS[y]?.[x - 1] ?? null,
    };
    const { exits } = ROOMS[room.id];
    ROOMS[room.id].exitTilePositions = _.values(
      _.mapValues(exits, (exit, direction) => {
        if (exit === null) {
          return null;
        }
        return ROOM_EXIT_POSITIONS[direction];
      })
    ).filter(_.identity);
    ROOMS[room.id].lockedExitTilePositions = [];

    ROOMS[room.id].centerPosition = getPositionFromCoordinates(1, 1);
  });
};

mapRooms();

const MONSTERS = [
  { name: "small goblin", maxHunger: 3, roomId: "2_M" },
  { name: "largish goblin", maxHunger: 5, roomId: "5_M" },
  { name: "small goblin", maxHunger: 3, roomId: "10_M" },
];

const roomMonsters = _.keyBy(
  MONSTERS.map((monster) => ({
    ...monster,
    hunger: monster.maxHunger,
    sated: false,
  })),
  (m) => m.roomId
);

export const ITEMS = [
  { id: "gold", name: "gold", value: 3 },
  { id: "silver", name: "silver", value: 2 },
  { id: "stick", name: "stick", value: 1 },
  { id: "rock", name: "rock", value: 1 },
  { id: "diamond", name: "diamond", value: 10 },
];

let roomItems = {
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
  "3_C": [],
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

roomItems = _.mapValues(roomItems, (items, roomId) => {
  return _.sortBy(
    items.map((item) => ({
      roomId,
      ...item,
      ...ITEMS.find((i) => i.id === item.itemId),
    })),
    "name"
  );
});

const inventory = _.sortBy(
  ITEMS.map((item) => ({
    ...item,
    itemId: item.id,
    quantity: 0,
  })),
  "name"
);

export const initialData = {
  currentRoom: ROOMS["0_C"],
  previousRoom: null,
  roomItems,
  inventory,
  roomMonsters,
  direction: null,
};

console.assert(
  _.values(ROOMS)
    .filter((r) => r.type === "monster")
    .every((r) => MONSTERS.find((m) => m.roomId === r.id)),
  "All rooms of type 'monster' must have a monster"
);

console.assert(
  MONSTERS.every((monster) =>
    ROOMS[monster.roomId] ? true : console.log("monster", monster)
  ),
  "All monsters must be in a room"
);

console.assert(
  MONSTERS.every((monster) => ROOMS[monster.roomId].type === "monster"),
  "All monsters must be in a room of type 'monster'"
);

console.assert(
  _.keys(roomItems).every((roomId) => {
    return ROOMS[roomId];
  }),
  "Some rooms items are not in the room list"
);

console.assert(
  _.values(ROOMS).filter((r) => r.type === "container").length ===
    _.keys(roomItems).length,
  "Some rooms are containers but have no item list",
  _.difference(
    _.values(ROOMS)
      .filter((r) => r.type === "container")
      .map((r) => r.id),
    ..._.keys(roomItems)
  )
);

console.assert(
  _.keys(roomItems).every((roomId) => {
    return ROOMS[roomId].type === "container" || console.error(roomId);
  }),
  `Some rooms have items but are not containers`
);
