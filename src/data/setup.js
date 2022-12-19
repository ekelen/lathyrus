import _ from "lodash";
import {
  CAPTIVE_LIST,
  CONTAINER_ITEMS,
  ITEMS_BY_ID,
  MAX_ITEMS,
  MONSTER_LIST,
  ROOMS_BY_ID,
} from "./constants";

const monstersByRoomId = _.keyBy(
  MONSTER_LIST.map((monster) => ({
    ...monster,
    hunger: monster.maxHunger,
    sated: false,
  })),
  "roomId"
);

let itemsByRoomId = { ...CONTAINER_ITEMS };
const mappedItems = _.keyBy(
  _.values(ITEMS_BY_ID).map((item) => ({
    ...item,
    itemId: item.id,
    quantity: 0,
  })),
  "id"
);

const containerRoomKeys = _.keys(
  _.pickBy(ROOMS_BY_ID, (room) => room.type === "container")
);

itemsByRoomId = _.fromPairs(
  containerRoomKeys.map((roomId) => {
    return [roomId, _.keyBy(itemsByRoomId[roomId] ?? [], "id")];
  })
);

itemsByRoomId = _.mapValues(itemsByRoomId, (items, roomId) => {
  return _.mapValues(mappedItems, (item) => {
    const quantity = items[item.id]?.quantity ?? 0;
    return {
      ...item,
      quantity,
      roomId,
    };
  });
});

// console.log(`[=] itemsByRoomId:`, itemsByRoomId);

const inventoryById = _.keyBy(
  _.values(ITEMS_BY_ID).map((item) => ({
    ...item,
    quantity: 0,
  })),
  "id"
);

const storageItemsById = _.keyBy(
  _.values(ITEMS_BY_ID).map((item) => ({
    ...item,
    quantity: 0,
  })),
  "id"
);

const captivesByRoomId = _.keyBy(CAPTIVE_LIST, "roomId");

export const initialState = {
  currentRoom: _.cloneDeep(ROOMS_BY_ID["0_C"]),
  previousRoom: null,
  itemsByRoomId: _.cloneDeep(itemsByRoomId),
  inventoryById: _.cloneDeep(inventoryById),
  monstersByRoomId: _.cloneDeep(monstersByRoomId),
  movedCameraToOnTransition: null,
  captivesByRoomId: _.cloneDeep(captivesByRoomId),
  haveKeysTo: [],
  storageItemsById: _.cloneDeep(storageItemsById),
  learnedRecipeIds: [],
  maxInventory: MAX_ITEMS,
};
