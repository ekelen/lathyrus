import _ from "lodash";
import {
  CAPTIVES_BY_ID,
  INVENTORY_BY_ID,
  ITEMS_BY_ROOM_ID,
  MAX_ITEMS,
  MONSTERS_BY_ROOM_ID,
  ROOMS_BY_ID,
} from "../data/data";

export const initialState = JSON.parse(
  JSON.stringify({
    currentRoom: ROOMS_BY_ID["0_C"],
    previousRoom: null,
    itemsByRoomId: ITEMS_BY_ROOM_ID,
    inventoryById: INVENTORY_BY_ID,
    monstersByRoomId: MONSTERS_BY_ROOM_ID,
    movedCameraToOnTransition: null,
    captivesByRoomId: CAPTIVES_BY_ID,
    haveKeysTo: [],
    learnedRecipeIds: [],
    maxInventory: MAX_ITEMS,
  })
);
