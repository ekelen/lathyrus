import _ from "lodash";

// const roomPositions = [
//   [0, 1, 2, 3, null],
//   [null, 4, 5, 6, 7],
//   [8, null, 9, null, 10],
//   [11, null, 12, 13, null],
//   [14, 15, null, 16, 17],
// ];

const ROOM_POSITIONS = [
  [0, null, null, null, null],
  [1, 2, null, null, null],
  [null, 3, 6, null, null],
  [null, 4, null, null, null],
  [null, 5, null, null, null],
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
];

export const MONSTERS = [
  { name: "small goblin", maxHunger: 3, roomId: 2 },
  { name: "largish goblin", maxHunger: 5, roomId: 5 },
];

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

export const ITEMS = [
  { id: "gold", name: "gold", value: 5 },
  { id: "silver", name: "silver", value: 3 },
  { id: "stick", name: "stick", value: 1 },
  { id: "rock", name: "rock", value: 1 },
  { id: "diamond", name: "diamond", value: 10 },
];

let roomItems = _.groupBy(
  [
    { roomId: 0, itemId: "stick", quantity: 3 },
    { roomId: 1, itemId: "silver", quantity: 1 },
    { roomId: 1, itemId: "gold", quantity: 1 },
    { roomId: 0, itemId: "silver", quantity: 3 },
    { roomId: 4, itemId: "silver", quantity: 3 },
    { roomId: 6, itemId: "silver", quantity: 3 },
    { roomId: 6, itemId: "rock", quantity: 3 },
    { roomId: 6, itemId: "diamond", quantity: 1 },
  ],
  "roomId"
);

roomItems = _.mapValues(roomItems, (items) => {
  return _.sortBy(
    items.map((item) => ({
      ...item,
      ...ITEMS.find((i) => i.id === item.itemId),
    })),
    "name"
  );
});

console.assert(
  _.keys(roomItems).every((roomId) => {
    return ROOMS.find((room) => room.id == roomId);
  }),
  "Some rooms items are not in the room list"
);

console.assert(
  _.keys(roomItems).every((roomId) => {
    return ROOMS.find((room) => room.id == roomId).type === "container";
  }),
  "Some rooms have items but are not containers"
);

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
    ROOMS[i].exitPositions = _.values(
      _.mapValues(exits, (exit, direction) => {
        if (exit === null) {
          return null;
        }
        return ROOM_EXIT_POSITIONS[direction];
      })
    ).filter(_.identity);

    ROOMS[i].centerPosition = getPositionFromCoordinates(1, 1);
  });
};

mapRooms();

const roomMonsters = _.keyBy(
  MONSTERS.map((monster) => ({
    ...monster,
    hunger: monster.maxHunger,
    sated: false,
  })),
  (m) => m.roomId
);

export const initialData = {
  rooms: ROOMS,
  currentRoom: ROOMS.find((room) => room.id === 0),
  previousRoom: ROOMS.find((room) => room.id === 1),
  roomItems,
  inventory,
  roomMonsters,
};
