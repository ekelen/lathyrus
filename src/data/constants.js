const ROOM_TYPES = {
  container: "container",
  monster: "monster",
  lab: "lab",
  captive: "captive",
  empty: "empty",
  exit: "exit",
};

const DIRECTION_OPPOSITE = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

const ROOM_SIZE = 3;

export { ROOM_TYPES, DIRECTION_OPPOSITE, ROOM_SIZE };
