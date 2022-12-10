import _, { cloneDeep, max } from "lodash";
import {
  DIRECTION_OPPOSITE,
  initialData,
  ROOMS,
  ROOM_EXIT_POSITIONS,
} from "../data/setup";

export const initialState = initialData;

const updateQuantity = ({ items, item, quantity }) => {
  const itemsCopy = [...items];
  const itemIdx = itemsCopy.findIndex((i) => i.itemId === item.itemId);
  if (itemIdx > -1) {
    itemsCopy[itemIdx].quantity += quantity;
  } else {
    itemsCopy.push({ ...item, quantity });
  }
  return _.sortBy(itemsCopy, "name");
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
  return _.sortBy(itemsCopy, "name");
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
        console.log("This way is locked!");
        return state;
      }

      const targetRoom = ROOMS[currentRoom.exits[direction]];
      const { exits } = targetRoom;
      const monster = roomMonsters[targetRoom.id] ?? null;
      const exitsUnlocked = !monster || monster.sated;
      const enteredRoomFrom = DIRECTION_OPPOSITE[direction];
      const lockedDirections = exitsUnlocked
        ? []
        : [
            ..._.filter(
              Object.keys(targetRoom.exits),
              (dir) => enteredRoomFrom !== dir && exits[dir]
            ),
          ];
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
    case "addToRoomFromInventory": {
      const { itemId, quantity } = action.payload;
      const { inventory, roomItems, currentRoom } = state;
      const currentRoomItems = roomItems[currentRoom.id];

      const inventoryItem = inventory.find((i) => i.itemId === itemId);
      const newInventoryItems = updateQuantity({
        items: inventory,
        item: inventoryItem,
        quantity: -quantity,
      });

      let roomItem = currentRoomItems.find((i) => i.itemId === itemId);
      if (!roomItem) {
        roomItem = {
          ...inventoryItem,
          roomId: currentRoom.id,
          quantity: 0,
        };
      }
      const newCurrentRoomItems = updateQuantity({
        items: currentRoomItems,
        item: roomItem,
        quantity,
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
      const { currentRoom, roomMonsters, inventory, roomItems } = state;
      const enemy = roomMonsters[currentRoom.id];
      if (enemy.sated) {
        console.log("enemy is sated");
        return state;
      }
      const inventoryItem = inventory.find((i) => i.itemId === itemId);
      const currentRoomItems = roomItems[currentRoom.id] ?? [];
      const { value } = inventoryItem;
      const satiationFactor = _.round(value * _.random(0.5, 1, true), 1);
      const newEnemy = {
        ...enemy,
        hunger: max([enemy.hunger - satiationFactor, 0]),
        sated: enemy.hunger - satiationFactor <= 0,
      };
      const newRoomMonsters = {
        ...roomMonsters,
        [currentRoom.id]: newEnemy,
      };
      if (newEnemy.sated) {
        const newInventoryItems = updateQuantity({
          items: inventory,
          item: inventoryItem,
          quantity: -1,
        });
        return {
          ...state,
          currentRoom: {
            ...currentRoom,
            lockedExitTilePositions: [],
            lockedDirections: [],
          },
          roomMonsters: newRoomMonsters,
          roomItems: {
            ...state.roomItems,
            [currentRoom.id]: [],
          },
          inventory: newInventoryItems,
        };
      } else {
        const newInventoryItems = updateQuantity({
          items: inventory,
          item: inventoryItem,
          quantity: -1,
        });
        const newCurrentRoomItems = updateQuantity({
          items: currentRoomItems,
          item: { ...inventoryItem, roomId: currentRoom.id, quantity: 0 },
          quantity: 1,
        });
        return {
          ...state,
          roomMonsters: newRoomMonsters,
          roomItems: {
            ...state.roomItems,
            [currentRoom.id]: newCurrentRoomItems,
          },
          inventory: newInventoryItems,
        };
      }
    }
    default: {
      console.error("Unknown action: " + action);
      return state;
    }
  }
}
