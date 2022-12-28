import _ from "lodash";
import {
  BASE_ITEM_LIST,
  ROOM_POSITIONS,
  BASE_ROOMS_LIST,
  BASE_MONSTER_LIST,
  BASE_CAPTIVE_LIST,
  CONTAINER_ITEMS,
  BASE_RECIPE_LIST,
} from "./baseData";
import { ROOM_TYPES } from "./constants";
import {
  getPositionFromCoordinates,
  keyBy,
  zipObject,
  ROOM_EXIT_POSITIONS,
} from "./util";

const MAX_ITEMS = 10;

const MAP_SIZE = ROOM_POSITIONS.length;

const ITEM_IDS = BASE_ITEM_LIST.map((item) => item.id);
const INVENTORY_BY_ID = Object.fromEntries(ITEM_IDS.map((id) => [id, 0]));

const RECIPES_BY_ID = keyBy(BASE_RECIPE_LIST, "id");

const itemColorsByValue = [
  "text-yellow-50",
  "text-green-200",
  "text-emerald-300",
  "text-teal-400",
  "text-cyan-400",
  "text-sky-400",
  "text-blue-400",
  "text-indigo-500",
  "text-violet-600",
  "text-violet-700",
  "text-violet-800",
];

const ITEMS_BY_ID = keyBy(
  BASE_ITEM_LIST.map((item) => ({
    ...item,
    quantity: 0,
    colorClass: itemColorsByValue[Math.log2(item.value)],
  })),
  "id"
);

const CONTAINER_ROOM_KEYS = BASE_ROOMS_LIST.filter(
  (r) => r.type === "container"
).map((r) => r.id);

const ITEMS_BY_ROOM_ID = zipObject(
  CONTAINER_ROOM_KEYS,
  CONTAINER_ROOM_KEYS.map((roomId) =>
    zipObject(
      ITEM_IDS,
      ITEM_IDS.map((itemId) => CONTAINER_ITEMS[roomId][itemId] ?? 0)
    )
  )
);

const ROOMS_BY_ID = keyBy(
  BASE_ROOMS_LIST.map((room) => {
    const type = room.type ?? ROOM_TYPES.empty;
    const y = ROOM_POSITIONS.findIndex((row) => row.includes(room.id));
    const x = ROOM_POSITIONS[y].findIndex((id) => id === room.id);
    const exits = {
      north: ROOM_POSITIONS[y - 1]?.[x] ?? null,
      south: ROOM_POSITIONS[y + 1]?.[x] ?? null,
      east: ROOM_POSITIONS[y]?.[x + 1] ?? null,
      west: ROOM_POSITIONS[y]?.[x - 1] ?? null,
    };
    const exitTilePositions = Object.values(
      _.mapValues(exits, (roomId, direction) =>
        roomId ? ROOM_EXIT_POSITIONS[direction] : null
      )
    ).filter((pos) => pos !== null);
    return {
      ...room,
      type,
      position: getPositionFromCoordinates(x, y),
      coordinates: { x, y },
      exits,
      exitTilePositions,
      lockedExitTilePositions: [],
      lockedDirections: [],
    };
  }),
  "id"
);

const CAPTIVE_LIST = BASE_CAPTIVE_LIST.map((captive) => ({
  ...captive,
  freed: false,
  dead: false,
  position: ROOMS_BY_ID[captive.roomId].position,
}));

const CAPTIVES_BY_ID = keyBy(CAPTIVE_LIST, "id");

const MONSTERS_BY_ROOM_ID = keyBy(
  BASE_MONSTER_LIST.map((monster) => ({
    ...monster,
    hunger: monster.maxHunger,
    sated: false,
    colorClass: itemColorsByValue[Math.log2(monster.maxHunger)],
  })),
  "roomId"
);

export {
  CAPTIVE_LIST,
  CAPTIVES_BY_ID,
  CONTAINER_ITEMS,
  ITEMS_BY_ID,
  ITEMS_BY_ROOM_ID,
  ITEM_IDS,
  INVENTORY_BY_ID,
  BASE_ITEM_LIST,
  MAP_SIZE,
  MAX_ITEMS,
  BASE_MONSTER_LIST,
  MONSTERS_BY_ROOM_ID,
  RECIPES_BY_ID,
  ROOMS_BY_ID,
  ROOM_POSITIONS,
};
