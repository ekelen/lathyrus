import _, { cloneDeep, max } from "lodash";
import { DIRECTION_OPPOSITE } from "../data/constants";
import {
  ITEMS_BY_ID,
  ITEM_IDS,
  RECIPES_BY_ID,
  ROOMS_BY_ID,
} from "../data/gameData";
import { initialState } from "./setup";
import { ROOM_EXIT_POSITIONS } from "../data/util";

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
        console.info("That way is locked");
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

    case "addToInventoryFromRoom": {
      const { itemId, quantity } = action.payload;
      const { inventoryById, itemsByRoomId, currentRoom } = state;

      const currentRoomItemQuantity = itemsByRoomId[currentRoom.id][itemId];
      if (currentRoomItemQuantity < quantity) {
        console.info("Not enough items in room");
        return state;
      }
      const currentInventoryItemQuantity = inventoryById[itemId];
      const newInventoryItems = {
        ...inventoryById,
        [itemId]: currentInventoryItemQuantity + quantity,
      };

      const newCurrentRoomItems = {
        ...itemsByRoomId[currentRoom.id],
        [itemId]: currentRoomItemQuantity - quantity,
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
    case "addAllToInventoryFromRoom": {
      const { inventoryById, itemsByRoomId, currentRoom } = state;
      const currentRoomItemQuantities = itemsByRoomId[currentRoom.id];

      const newInventoryItems = _.zipObject(
        ITEM_IDS,
        ITEM_IDS.map(
          (itemId) => currentRoomItemQuantities[itemId] + inventoryById[itemId]
        )
      );

      const newCurrentRoomItems = _.zipObject(
        ITEM_IDS,
        ITEM_IDS.map(() => 0)
      );

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
        console.info("monster is sated");
        return state;
      }
      const item = ITEMS_BY_ID[itemId];
      const { value } = item;
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
        [itemId]: inventoryById[itemId] - 1,
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
        console.info(`don't have key for ${roomId} captive ${captive.id}`);
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
        console.info(`Don't have recipe for ${recipeId}`);
        return state;
      }
      const recipe = RECIPES_BY_ID[recipeId];
      const hasIngredients = recipe.ingredients.every((ingredient) => {
        const inventoryQuantity = inventoryById[ingredient.itemId];

        return inventoryQuantity >= ingredient.quantity;
      });
      if (!hasIngredients) {
        console.info(`don't have ingredients for ${recipeId}`);
        return state;
      }
      const updatedIngredientInventory = _.zipObject(
        recipe.ingredients.map((i) => i.itemId),
        recipe.ingredients.map((i) => inventoryById[i.itemId] - i.quantity)
      );
      return {
        ...state,
        inventoryById: {
          ...inventoryById,
          [recipeId]: inventoryById[recipeId] + 1,
          ...updatedIngredientInventory,
        },
      };
    }
    default: {
      console.error("Unknown action: " + action);
      return state;
    }
  }
}
