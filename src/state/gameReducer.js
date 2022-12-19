import _, { cloneDeep, max } from "lodash";
import {
  DIRECTION_OPPOSITE,
  RECIPES_BY_ID,
  ROOMS_BY_ID,
  ROOM_EXIT_POSITIONS,
} from "../data/constants";
import { initialState } from "../data/setup";
import { sortByName } from "../data/util";

export function gameReducer(state, action) {
  switch (action.type) {
    case "reset": {
      return cloneDeep(initialState);
    }
    case "move": {
      const { direction } = action.payload;
      const { currentRoom, monstersByRoomId } = state;
      const isLocked = currentRoom.lockedExitTilePositions?.includes(
        ROOM_EXIT_POSITIONS[direction]
      );
      if (isLocked) {
        // console.error("That way is locked");
        return state;
      }

      const targetRoom = ROOMS_BY_ID[currentRoom.exits[direction]];
      const { exits } = targetRoom;
      const exitDirections = _.keys(exits).filter((dir) => exits[dir]);
      const monster = monstersByRoomId[targetRoom.id] ?? null;
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
    case "addToInventoryFromStorage": {
      const { itemId, quantity } = action.payload;
      const { inventoryById, storageItemsById } = state;

      const storageItem = storageItemsById[itemId];
      const newStorageItems = {
        ...storageItemsById,
        [itemId]: {
          ...storageItem,
          quantity: storageItem.quantity - quantity,
        },
      };
      const inventoryItem = inventoryById[itemId];

      const newInventoryItems = {
        ...inventoryById,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity + quantity,
        },
      };

      return {
        ...state,
        storageItemsById: newStorageItems,
        inventoryById: newInventoryItems,
      };
    }
    case "addToStorageFromInventory": {
      const { itemId, quantity } = action.payload;
      const { inventoryById, storageItemsById } = state;

      const inventoryItem = inventoryById[itemId];
      const newInventoryItems = {
        ...inventoryById,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity - quantity,
        },
      };
      const storageItem = storageItemsById[itemId];

      const newStorageItems = {
        ...storageItemsById,
        [itemId]: {
          ...storageItem,
          quantity: storageItem.quantity + quantity,
        },
      };

      return {
        ...state,
        storageItemsById: newStorageItems,
        inventoryById: newInventoryItems,
      };
    }
    case "updateInventoryQuantity": {
      const { itemId, quantity } = action.payload;
      const { inventoryById } = state;

      const inventoryItem = inventoryById[itemId];
      const newInventoryItems = {
        ...inventoryById,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity + quantity,
        },
      };

      return {
        ...state,
        inventoryById: newInventoryItems,
      };
    }
    case "addToInventoryFromRoom": {
      const { itemId, quantity } = action.payload;
      const { inventoryById, itemsByRoomId, currentRoom } = state;

      const roomItem = itemsByRoomId[currentRoom.id][itemId];
      const inventoryItem = inventoryById[itemId];
      const newInventoryItems = {
        ...inventoryById,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity + quantity,
        },
      };

      const newCurrentRoomItems = {
        ...itemsByRoomId[currentRoom.id],
        [itemId]: {
          ...roomItem,
          quantity: roomItem.quantity - quantity,
        },
      };

      return {
        ...state,
        itemsByRoomId: {
          ...itemsByRoomId,
          [currentRoom.id]: newCurrentRoomItems,
        },
        inventoryById: newInventoryItems,
      };
    }
    case "feed": {
      const { itemId } = action.payload;
      const { currentRoom, monstersByRoomId, inventoryById } = state;
      const monster = monstersByRoomId[currentRoom.id];
      const { hasKeyTo } = monster;
      if (monster.sated) {
        // console.log("monster is sated");
        return state;
      }
      const inventoryItem = inventoryById[itemId];
      const { value } = inventoryItem;
      const hunger = max([monster.hunger - value, 0]);
      const sated = hunger === 0;
      const newMonster = {
        ...monster,
        hunger,
        sated,
        hasKeyTo: sated ? null : hasKeyTo,
      };
      const newRoomMonsters = {
        ...monstersByRoomId,
        [currentRoom.id]: newMonster,
      };
      const newInventoryItems = {
        ...inventoryById,
        [itemId]: {
          ...inventoryItem,
          quantity: inventoryItem.quantity - 1,
        },
      };
      if (newMonster.sated) {
        const haveKeysTo = hasKeyTo
          ? [...state.haveKeysTo, hasKeyTo].sort()
          : state.haveKeysTo;
        return {
          ...state,
          currentRoom: {
            ...currentRoom,
            lockedExitTilePositions: [],
            lockedDirections: [],
          },
          haveKeysTo,
          monstersByRoomId: newRoomMonsters,
          inventoryById: newInventoryItems,
        };
      } else {
        return {
          ...state,
          monstersByRoomId: newRoomMonsters,
          inventoryById: newInventoryItems,
        };
      }
    }
    case "freeCaptive": {
      const { captivesByRoomId, haveKeysTo } = state;
      const { roomId } = action.payload;
      const captive = captivesByRoomId[roomId];
      if (!haveKeysTo.includes(captive.id)) {
        // console.error(`don't have key for ${roomId} captive ${captive.id}`);
        return state;
      }
      return {
        ...state,
        captivesByRoomId: {
          ...captivesByRoomId,
          [roomId]: {
            ...captive,
            freed: true,
          },
        },
        learnedRecipeIds: _.union(state.learnedRecipeIds, [
          captive.teaches.recipeId,
        ]),
      };
    }
    case "combineItems": {
      const { inventoryById, learnedRecipeIds } = state;
      const { recipeId } = action.payload;

      if (!learnedRecipeIds.includes(recipeId)) {
        // console.error(`Don't have recipe for ${recipeId}`);
        return state;
      }
      const recipe = RECIPES_BY_ID[recipeId];
      const hasIngredients = recipe.ingredients.every((ingredient) => {
        const inventoryItem = inventoryById[ingredient.itemId];
        return inventoryItem.quantity >= ingredient.quantity;
      });
      if (!hasIngredients) {
        // console.error(`don't have ingredients for ${recipeId}`);
        return state;
      }
      const createdItem = {
        ...inventoryById[recipeId],
        quantity: inventoryById[recipeId].quantity + 1,
      };
      const ingredientInventoryItems = recipe.ingredients
        .map((i) => i.itemId)
        .reduce((acc, itemId) => {
          const inventoryItem = inventoryById[itemId];
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
        inventoryById: {
          ...inventoryById,
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
