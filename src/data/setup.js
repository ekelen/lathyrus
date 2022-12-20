import _ from "lodash";
import {
  CAPTIVES_BY_ID,
  INVENTORY_BY_ID,
  ITEMS_BY_ROOM_ID,
  MAX_ITEMS,
  MONSTERS_BY_ROOM_ID,
  ROOMS_BY_ID,
  STORAGE_ITEMS_BY_ID,
} from "./constants";

export const initialState = {
  currentRoom: _.cloneDeep(ROOMS_BY_ID["0_C"]),
  previousRoom: null,
  itemsByRoomId: _.cloneDeep(ITEMS_BY_ROOM_ID),
  inventoryById: _.cloneDeep(INVENTORY_BY_ID),
  monstersByRoomId: _.cloneDeep(MONSTERS_BY_ROOM_ID),
  movedCameraToOnTransition: null,
  captivesByRoomId: _.cloneDeep(CAPTIVES_BY_ID),
  haveKeysTo: [],
  storageItemsById: _.cloneDeep(STORAGE_ITEMS_BY_ID),
  learnedRecipeIds: [],
  maxInventory: MAX_ITEMS,
};
