import _, { cloneDeep, max } from "lodash";
import {
  DIRECTION_OPPOSITE,
  RECIPES,
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
        console.error("That way is locked");
        return state;
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

      const inventoryItem = inventory[itemId];
      const newInventoryItems = {
        ...inventory,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity - quantity,
        },
      };
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
    case "updateInventoryQuantity": {
      const { itemId, quantity } = action.payload;
      const { inventory } = state;

      const inventoryItem = inventory[itemId];
      const newInventoryItems = {
        ...inventory,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity + quantity,
        },
      };

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
      const inventoryItem = inventory[itemId];
      const newInventoryItems = {
        ...inventory,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity + quantity,
        },
      };

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
      const monster = roomMonsters[currentRoom.id];
      if (monster.sated && monster.hasKeyTo) {
        return {
          ...state,
          roomMonsters: {
            ...roomMonsters,
            [currentRoom.id]: {
              ...monster,
              hasKeyTo: null,
            },
          },
        };
      }
      if (monster.sated) {
        console.log("monster is sated");
        return state;
      }
      const inventoryItem = inventory[itemId];
      const { value } = inventoryItem;
      const hunger = max([monster.hunger - value, 0]);
      const sated = hunger === 0;
      const newMonster = {
        ...monster,
        hunger,
        sated,
      };
      const newRoomMonsters = {
        ...roomMonsters,
        [currentRoom.id]: newMonster,
      };
      const newInventoryItems = {
        ...inventory,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity - 1,
        },
      };
      if (newMonster.sated) {
        const haveKeysTo = monster.hasKeyTo
          ? [...state.haveKeysTo, monster.hasKeyTo].sort()
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
        console.error(`don't have key for ${roomId} captive ${captive.id}`);
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
        learnedRecipes: _.union(state.learnedRecipes, [
          captive.teaches.recipeId,
        ]),
      };
    }
    case "combineItems": {
      const { inventory, learnedRecipes } = state;
      const { recipeId } = action.payload;

      if (!learnedRecipes.includes(recipeId)) {
        console.error(`Don't have recipe for ${recipeId}`);
        return state;
      }
      const recipe = RECIPES[recipeId];
      const hasIngredients = recipe.ingredients.every((ingredient) => {
        const inventoryItem = inventory[ingredient.itemId];
        return inventoryItem.quantity >= ingredient.quantity;
      });
      if (!hasIngredients) {
        console.error(`don't have ingredients for ${recipeId}`);
        return state;
      }
      const createdItem = {
        ...inventory[recipeId],
        quantity: inventory[recipeId].quantity + 1,
      };
      const ingredientInventoryItems = recipe.ingredients
        .map((i) => i.itemId)
        .reduce((acc, itemId) => {
          const inventoryItem = inventory[itemId];
          return {
            ...acc,
            [itemId]: {
              ...inventoryItem,
              quantity: inventoryItem.quantity - 1,
            },
          };
        }, {});
      // wip
      return {
        ...state,
        inventory: {
          ...inventory,
          ...ingredientInventoryItems,
          [recipeId]: createdItem,
        },
      };
    }
    default: {
      console.error("Unknown action: " + action);
      return state;
    }
  }
}
