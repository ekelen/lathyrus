import _, { cloneDeep, max } from "lodash";
import {
  DIRECTION_OPPOSITE,
  ROOMS,
  ROOM_EXIT_POSITIONS,
} from "../data/constants";
import { initialState } from "../data/setup";
import { sortByName } from "../data/util";

const updateQuantity = ({ items, item, quantity }) => {
  const itemsCopy = [...items];
  const itemIdx = itemsCopy.findIndex((i) => i.itemId === item.itemId);
  if (itemIdx > -1) {
    itemsCopy[itemIdx].quantity += quantity;
  } else {
    itemsCopy.push({ ...item, quantity });
  }
  return sortByName(itemsCopy);
};

const updateQuantityMany = ({ existingItems, upsertItems }) => {
  const itemsCopy = [...existingItems];
  upsertItems.forEach((item) => {
    const itemIdx = itemsCopy.findIndex((i) => i.itemId === item.itemId);
    if (itemIdx > -1) {
      itemsCopy[itemIdx].quantity += item.quantity;
    } else {
      itemsCopy.push({ ...item, quantity: item.quantity });
    }
  });
  return sortByName(itemsCopy);
};

export function gameReducer(state, action) {
  switch (action.type) {
    case "reset": {
      return cloneDeep({ ...initialState });
    }
    case "move": {
      const { direction } = action.payload;
      const { currentRoom, roomMonsters } = state;
      const isLocked = currentRoom.lockedExitTilePositions?.includes(
        ROOM_EXIT_POSITIONS[direction]
      );
      if (isLocked) {
        throw new Error("That way is locked");
      }

      const targetRoom = ROOMS[currentRoom.exits[direction]];
      const { exits } = targetRoom;
      const exitDirections = _.keys(exits).filter((dir) => exits[dir]);
      const monster = roomMonsters[targetRoom.id] ?? null;
      const noLockedExits = !monster || monster.sated;
      const lockedDirections = noLockedExits
        ? []
        : _.without(exitDirections, DIRECTION_OPPOSITE[direction]);
      const lockedExitTilePositions = lockedDirections.map(
        (dir) => ROOM_EXIT_POSITIONS[dir]
      );
      return {
        ...state,
        previousRoom: currentRoom,
        currentRoom: {
          ...targetRoom,
          lockedExitTilePositions,
          lockedDirections,
        },
        movedCameraToOnTransition: direction,
      };
    }
    case "addToStorageFromInventory": {
      const { itemId, quantity } = action.payload;
      const { inventory, storageItems } = state;

      const inventoryItem = inventory.find((i) => i.itemId === itemId);
      const newInventoryItems = updateQuantity({
        items: inventory,
        item: inventoryItem,
        quantity: -quantity,
      });
      const storageItem = storageItems.find((i) => i.itemId === itemId) ?? {
        ...inventoryItem,
        quantity: 0,
      };

      const newStorageItems = updateQuantity({
        items: storageItems,
        item: storageItem,
        quantity,
      });

      return {
        ...state,
        storageItems: newStorageItems,
        inventory: newInventoryItems,
      };
    }
    case "addToInventory": {
      const { itemId, quantity } = action.payload;
      const { inventory } = state;

      const inventoryItem = inventory.find((i) => i.itemId === itemId);
      const newInventoryItems = updateQuantity({
        items: inventory,
        item: inventoryItem,
        quantity,
      });

      return {
        ...state,
        inventory: newInventoryItems,
      };
    }
    case "addToInventoryFromRoom": {
      const { itemId, quantity } = action.payload;
      const { inventory, roomItems, currentRoom } = state;

      const roomItem = roomItems[currentRoom.id].find(
        (i) => i.itemId === itemId
      );
      const inventoryItem = inventory.find((i) => i.itemId === itemId);
      const newInventoryItems = updateQuantity({
        items: inventory,
        item: inventoryItem,
        quantity,
      });
      const newCurrentRoomItems = updateQuantity({
        items: roomItems[currentRoom.id],
        item: roomItem,
        quantity: -quantity,
      });

      return {
        ...state,
        roomItems: {
          ...roomItems,
          [currentRoom.id]: newCurrentRoomItems,
        },
        inventory: newInventoryItems,
      };
    }
    case "feed": {
      const { itemId } = action.payload;
      const { currentRoom, roomMonsters, inventory } = state;
      const enemy = roomMonsters[currentRoom.id];
      if (enemy.sated) {
        console.log("enemy is sated");
        return state;
      }
      const inventoryItem = inventory.find((i) => i.itemId === itemId);
      const { value } = inventoryItem;
      // const satiationFactor = _.round(value * _.random(0.5, 1, true), 1);
      // const satiationFactor = value;
      const hunger = max([enemy.hunger - value, 0]);
      const sated = hunger === 0;
      const newMonster = {
        ...enemy,
        hunger,
        sated,
      };
      const newRoomMonsters = {
        ...roomMonsters,
        [currentRoom.id]: newMonster,
      };
      if (newMonster.sated) {
        const newInventoryItems = updateQuantity({
          items: inventory,
          item: inventoryItem,
          quantity: -1,
        });
        const haveKeysTo = newMonster.hasKeyTo
          ? _.union(state.haveKeysTo, [newMonster.hasKeyTo]).sort()
          : state.haveKeysTo;
        return {
          ...state,
          currentRoom: {
            ...currentRoom,
            lockedExitTilePositions: [],
            lockedDirections: [],
          },
          haveKeysTo,
          roomMonsters: newRoomMonsters,
          inventory: newInventoryItems,
        };
      } else {
        const newInventoryItems = updateQuantity({
          items: inventory,
          item: inventoryItem,
          quantity: -1,
        });
        return {
          ...state,
          roomMonsters: newRoomMonsters,
          inventory: newInventoryItems,
        };
      }
    }
    case "freeCaptive": {
      const { captives, haveKeysTo } = state;
      const { roomId } = action.payload;
      const captive = captives[roomId];
      if (!haveKeysTo.includes(captive.id)) {
        console.log(`don't have key for ${roomId} captive ${captive.id}`);
        return state;
      }
      return {
        ...state,
        captives: {
          ...captives,
          [roomId]: {
            ...captive,
            freed: true,
          },
        },
      };
    }
    default: {
      console.error("Unknown action: " + action);
      return state;
    }
  }
}
