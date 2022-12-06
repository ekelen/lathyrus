import _, { cloneDeep } from "lodash";
import { initialData } from "../data/setup";

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
      return _.cloneDeep({ ...initialState });
    }
    case "move": {
      const { direction } = action.payload;
      const { currentRoom, rooms } = state;
      const exitRoom = rooms[currentRoom.exits[direction]];
      return {
        ...state,
        previousRoom: currentRoom,
        currentRoom: exitRoom,
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
      if (!roomItem) {
        console.error(`No item with id ${itemId} in room ${currentRoom}`);
        return state;
      }
      const inventoryItem = inventory.find((i) => i.itemId === itemId);
      if (!inventoryItem) {
        console.error(`No item with id ${itemId} in inventory`);
        return state;
      }
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
      if (inventoryItem.quantity < 1) {
        console.error(`No item with id ${itemId} in inventory`);
        return state;
      }
      const { value } = inventoryItem;
      const newEnemy = {
        ...enemy,
        hunger: enemy.hunger - value,
        sated: enemy.hunger - value <= 0,
      };
      const newRoomMonsters = {
        ...roomMonsters,
        [currentRoom.id]: newEnemy,
      };
      if (newEnemy.sated) {
        const newInventoryItems = updateQuantityMany({
          existingItems: inventory,
          upsertItems: currentRoomItems,
        });
        return {
          ...state,
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
