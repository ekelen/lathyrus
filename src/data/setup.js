import _ from "lodash";
import {
  ITEMS,
  MONSTERS,
  ROOMS,
  ROOM_POSITIONS,
  CAPTIVES,
  ROOM_EXIT_POSITIONS,
  CONTAINER_ITEMS,
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

const mapRoomItems = () => {
  _.values(ROOMS).forEach((room) => {
    if (!containerItems[room.id]) {
      containerItems[room.id] = [];
    }
  });
  _.keys(containerItems).forEach((roomId) => {
    containerItems[roomId] = sortByName(
      containerItems[roomId].map((item) => {
        return {
          ...item,
          ...ITEMS[item.itemId],
          roomId,
        };
      })
    );
  });
};

mapRoomItems();

const inventory = _.keyBy(
  _.values(ITEMS).map((item) => ({
    ...item,
    itemId: item.id,
    quantity:
      (item.id === "tin" ||
        item.id === "frostFarthing" ||
        item.id === "gildedGroat") &&
      process.env.NODE_ENV === "development"
        ? 10
        : 0,
  })),
  "id"
);

const captives = _.keyBy(CAPTIVES, "roomId");

export const initialState = {
  currentRoom: ROOMS["0_C"],
  previousRoom: null,
  roomItems: containerItems,
  inventory,
  roomMonsters,
  movedCameraToOnTransition: null,
  captives,
  haveKeysTo: [],
  storageItems: [],
  learnedRecipeIds: [],
};
