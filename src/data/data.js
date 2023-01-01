import {
  BASE_ITEM_LIST,
  BASE_CAPTIVE_LIST,
  BASE_RECIPE_LIST,
} from "./baseData";
import { ROOM_TYPES } from "./constants";
import { levels } from "./levels";
import {
  getPositionFromCoordinates,
  keyBy,
  zipObject,
  ROOM_EXIT_POSITIONS,
  mapValues,
} from "./util";

const { level00, level01 } = levels;

const MAX_ITEMS = 10;

const MAP_SIZE = level00.LEVEL_ROOM_POSITIONS.length;

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

const containerRoomIds = (baseRoomList) =>
  baseRoomList.filter((r) => r.type === "container").map((r) => r.id);

const itemsByContainerRoomIds = (containerRoomIds, containerItems) =>
  zipObject(
    containerRoomIds,
    containerRoomIds.map((roomId) =>
      zipObject(
        ITEM_IDS,
        ITEM_IDS.map((itemId) => containerItems[roomId][itemId] ?? 0)
      )
    )
  );

const ITEMS_BY_CONTAINER_ROOM_ID = itemsByContainerRoomIds(
  containerRoomIds([
    ...level00.LEVEL_BASE_ROOMS_LIST,
    ...level01.LEVEL_BASE_ROOMS_LIST,
  ]),
  { ...level00.LEVEL_CONTAINER_ITEMS, ...level01.LEVEL_CONTAINER_ITEMS }
);

const levelRoomsById = (baseRoomList, roomPositions, levelId) =>
  keyBy(
    baseRoomList.map((room) => {
      const type = room.type ?? ROOM_TYPES.empty;
      const y = roomPositions.findIndex((row) => row.includes(room.id));
      const x = roomPositions[y].findIndex((id) => id === room.id);
      const exits = {
        north: roomPositions[y - 1]?.[x] ?? null,
        south: roomPositions[y + 1]?.[x] ?? null,
        east: roomPositions[y]?.[x + 1] ?? null,
        west: roomPositions[y]?.[x - 1] ?? null,
      };
      const exitTilePositions = Object.values(
        mapValues(exits, (roomId, direction) =>
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
        levelId,
      };
    }),
    "id"
  );

const ROOMS_BY_ID = {
  ...levelRoomsById(
    level00.LEVEL_BASE_ROOMS_LIST,
    level00.LEVEL_ROOM_POSITIONS,
    "level00"
  ),
  ...levelRoomsById(
    level01.LEVEL_BASE_ROOMS_LIST,
    level01.LEVEL_ROOM_POSITIONS,
    "level01"
  ),
};

const CAPTIVE_LIST = BASE_CAPTIVE_LIST.map((captive) => ({
  ...captive,
  freed: false,
  dead: false,
  // position: ROOMS_BY_ID[captive.roomId].position,
}));

const CAPTIVES_BY_ID = keyBy(CAPTIVE_LIST, "id");

const monstersByRoomId = (monsterList) =>
  keyBy(
    monsterList.map((monster) => ({
      ...monster,
      hunger: monster.maxHunger,
      sated: false,
      colorClass: itemColorsByValue[Math.log2(monster.maxHunger)],
    })),
    "roomId"
  );

const LEVEL_MONSTERS_BY_ROOM_ID = monstersByRoomId([
  ...level00.LEVEL_BASE_MONSTER_LIST,
  ...level01.LEVEL_BASE_MONSTER_LIST,
]);

const LEVEL_EXITS_BY_ROOM_ID = {
  ...level00.LEVEL_EXITS_BY_ROOM_ID,
  ...level01.LEVEL_EXITS_BY_ROOM_ID,
};

export {
  CAPTIVE_LIST,
  CAPTIVES_BY_ID,
  ITEMS_BY_ID,
  ITEMS_BY_CONTAINER_ROOM_ID,
  ITEM_IDS,
  INVENTORY_BY_ID,
  BASE_ITEM_LIST,
  MAP_SIZE,
  MAX_ITEMS,
  LEVEL_MONSTERS_BY_ROOM_ID,
  RECIPES_BY_ID,
  ROOMS_BY_ID,
  LEVEL_EXITS_BY_ROOM_ID,
};
