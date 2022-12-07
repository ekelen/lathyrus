import _ from "lodash";

const ROOM_POSITIONS = [
  [0, null, 13, null, null],
  [1, 2, null, 12, null],
  [null, 3, 6, 10, 11],
  [null, 4, null, 9, null],
  [null, 5, 7, 8, null],
];

export const MAP_HEIGHT = ROOM_POSITIONS.length;
export const MAP_WIDTH = ROOM_POSITIONS[0].length;
export const ROOM_HEIGHT = 3;
export const ROOM_WIDTH = 3;

export const getPositionFromCoordinates = (x, y) => {
  return y * ROOM_WIDTH + x;
};

export const getCoordinatesFromPosition = (position) => {
  return {
    x: position % ROOM_WIDTH,
    y: Math.floor(position / ROOM_WIDTH),
  };
};

export const ROOM_EXIT_POSITIONS = {
  north: getPositionFromCoordinates(1, 0),
  east: getPositionFromCoordinates(2, 1),
  south: getPositionFromCoordinates(1, 2),
  west: getPositionFromCoordinates(0, 1),
};

const ROOMS = [
  { id: 0, name: "Room 0", type: "container", containerName: "fancy chest" },
  {
    id: 1,
    name: "Room 1",
    type: "container",
    containerName: "inconspicuous sack",
  },
  { id: 2, name: "Room 2", type: "monster", monsterName: "spooky ghost" },
  { id: 3, name: "Room 3", type: "container", containerName: "small box" },
  { id: 4, name: "Room 4", type: "container", containerName: "canvas sack" },
  { id: 5, name: "Room 5", type: "monster" },
  { id: 6, name: "Room 6", type: "container", containerName: "large crate" },
  { id: 7, name: "Room 7", type: "container", containerName: "small crate" },
  { id: 8, name: "Room 8", type: "container", containerName: "tiny crate" },
  { id: 9, name: "Room 9", type: "container", containerName: "huge box" },
  { id: 10, name: "Room 10", type: "monster" },
  { id: 11, name: "Room 11", type: "container", containerName: "small box" },
  { id: 12, name: "Room 12" },
  { id: 13, name: "Room 13" },
];

export const MONSTERS = [
  { name: "small goblin", maxHunger: 3, roomId: 2 },
  { name: "largish goblin", maxHunger: 5, roomId: 5 },
  { name: "small goblin", maxHunger: 3, roomId: 10 },
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
  { id: "gold", name: "gold", value: 5 },
  { id: "silver", name: "silver", value: 3 },
  { id: "stick", name: "stick", value: 1 },
  { id: "rock", name: "rock", value: 1 },
  { id: "diamond", name: "diamond", value: 10 },
];

let roomItems = {
  0: [
    {
      itemId: "stick",
      quantity: 3,
    },
    {
      itemId: "silver",
      quantity: 3,
    },
  ],
  1: [
    {
      itemId: "silver",
      quantity: 1,
    },
    {
      itemId: "gold",
      quantity: 1,
    },
  ],
  3: [],
  4: [
    {
      itemId: "silver",
      quantity: 3,
    },
  ],
  6: [
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
  7: [
    {
      itemId: "rock",
      quantity: 3,
    },
  ],
  8: [
    {
      itemId: "rock",
      quantity: 3,
    },
  ],
  9: [
    {
      itemId: "stick",
      quantity: 3,
    },
    {
      itemId: "diamond",
      quantity: 3,
    },
  ],
  11: [],
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

const mapRooms = () => {
  ROOMS.forEach((room, i) => {
    const y = ROOM_POSITIONS.findIndex((row) => row.includes(room.id));
    const x = ROOM_POSITIONS[y].findIndex((id) => id === room.id);
    ROOMS[i].coordinates = { x, y };
  });
  ROOMS.forEach((room, i) => {
    const { x, y } = room.coordinates;
    ROOMS[i].exits = {
      north: ROOM_POSITIONS[y - 1]?.[x] ?? null,
      south: ROOM_POSITIONS[y + 1]?.[x] ?? null,
      east: ROOM_POSITIONS[y]?.[x + 1] ?? null,
      west: ROOM_POSITIONS[y]?.[x - 1] ?? null,
    };
    const { exits } = ROOMS[i];
    ROOMS[i].exitTilePositions = _.values(
      _.mapValues(exits, (exit, direction) => {
        if (exit === null) {
          return null;
        }
        return ROOM_EXIT_POSITIONS[direction];
      })
    ).filter(_.identity);
    ROOMS[i].lockedExitTilePositions = [];

    ROOMS[i].centerPosition = getPositionFromCoordinates(1, 1);
  });
};

mapRooms();

export const initialData = {
  rooms: ROOMS,
  currentRoom: ROOMS.find((room) => room.id === 0),
  previousRoom: null,
  roomItems,
  inventory,
  roomMonsters,
  direction: null,
};

console.assert(
  ROOMS.filter((r) => r.type === "monster").every((r) =>
    MONSTERS.find((m) => m.roomId == r.id)
  ),
  "All rooms of type 'monster' must have a monster"
);

console.assert(
  MONSTERS.every((monster) => ROOMS.find((room) => room.id == monster.roomId)),
  "All monsters must be in a room"
);

console.assert(
  MONSTERS.every(
    (monster) =>
      ROOMS.find((room) => room.id == monster.roomId).type === "monster"
  ),
  "All monsters must be in a room of type 'monster'"
);

console.assert(
  _.keys(roomItems).every((roomId) => {
    return ROOMS.find((room) => room.id == roomId);
  }),
  "Some rooms items are not in the room list"
);

console.assert(
  ROOMS.filter((r) => r.type === "container").length ===
    _.keys(roomItems).length,
  "Some rooms are containers but have no item list",
  ROOMS.filter((r) => r.type === "container").map((r) => r.id),
  _.keys(roomItems),
  _.difference(
    ROOMS.filter((r) => r.type === "container").map((r) => r.id),
    ..._.keys(roomItems)
  )
);

console.assert(
  _.keys(roomItems).every((roomId) => {
    return ROOMS.find((room) => room.id == roomId).type === "container";
  }),
  `Some rooms have items but are not containers`
);
