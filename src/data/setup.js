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

let roomItems = { ...CONTAINER_ITEMS };

const mapRoomItems = () => {
  _.values(ROOMS).forEach((room) => {
    if (!roomItems[room.id]) {
      roomItems[room.id] = [];
    }
  });
  _.keys(roomItems).forEach((roomId) => {
    roomItems[roomId] = sortByName(
      roomItems[roomId].map((item) => {
        return {
          ...item,
          ...ITEMS.find((i) => i.id === item.itemId),
          roomId,
        };
      })
    );
  });
};

mapRoomItems();

const inventory = sortByName(
  ITEMS.map((item) => ({
    ...item,
    itemId: item.id,
    quantity:
      item.id === "diamond" && process.env.NODE_ENV === "development" ? 10 : 0,
  }))
);

const captives = _.keyBy(CAPTIVES, "roomId");

export const initialState = {
  currentRoom: ROOMS["0_C"],
  previousRoom: null,
  roomItems,
  inventory,
  roomMonsters,
  movedCameraToOnTransition: null,
  captives,
  haveKeysTo: [],
  storageItems: [],
  // computed: {
  //   addToInventoryFromRoomMultiplier: { gold: 1 },
  // },
};
