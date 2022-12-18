import _, { cloneDeep } from "lodash";
import {
  ITEMS,
  MONSTERS,
  ROOMS,
  ROOM_POSITIONS,
  CAPTIVE_LIST,
  ROOM_EXIT_POSITIONS,
  CONTAINER_ITEMS,
  MAX_ITEMS,
} from "./constants";
import { getPositionFromCoordinates, sortByName } from "./util";

const roomMonsters = _.keyBy(
  MONSTERS.map((monster) => ({
    ...monster,
    hunger: monster.maxHunger,
    sated: false,
  })),
  "roomId"
);

let containerItems = { ...CONTAINER_ITEMS };
const mappedItems = _.keyBy(
  _.values(ITEMS).map((item) => ({
    ...item,
    itemId: item.id,
    quantity: 0,
  })),
  "id"
);

const containerRoomKeys = _.keys(
  _.pickBy(ROOMS, (room) => room.type === "container")
);

containerItems = _.fromPairs(
  containerRoomKeys.map((roomId) => {
    return [roomId, _.keyBy(containerItems[roomId] ?? [], "id")];
  })
);

containerItems = _.mapValues(containerItems, (items, roomId) => {
  return _.mapValues(mappedItems, (item) => {
    const quantity = items[item.id]?.quantity ?? 0;
    return {
      ...item,
      quantity,
      roomId,
    };
  });
});

// console.log(`[=] containerItems:`, containerItems);

const inventory = _.keyBy(
  _.values(ITEMS).map((item) => ({
    ...item,
    quantity: 0,
  })),
  "id"
);

const storageItems = _.keyBy(
  _.values(ITEMS).map((item) => ({
    ...item,
    quantity: 0,
  })),
  "id"
);

const captives = _.keyBy(CAPTIVE_LIST, "roomId");

export const initialState = {
  currentRoom: _.cloneDeep(ROOMS["0_C"]),
  previousRoom: null,
  roomItems: _.cloneDeep(containerItems),
  inventory: _.cloneDeep(inventory),
  roomMonsters: _.cloneDeep(roomMonsters),
  movedCameraToOnTransition: null,
  captives: _.cloneDeep(captives),
  haveKeysTo: [],
  storageItems: _.cloneDeep(storageItems),
  learnedRecipeIds: [],
  maxInventory: MAX_ITEMS,
};
