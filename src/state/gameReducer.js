import { DIRECTION_OPPOSITE, ROOM_TYPES } from "../data/constants";
import {
  ITEMS_BY_ID,
  ITEM_IDS,
  LEVEL_EXITS_BY_ROOM_ID,
  RECIPES_BY_ID,
  ROOMS_BY_ID,
} from "../data/data";
import {
  mapValues,
  pickBy,
  ROOM_EXIT_POSITIONS,
  uniq,
  zipObject,
} from "../util/util";
import { initialState } from "./setup";

export function gameReducer(state, action) {
  switch (action.type) {
    case "reset": {
      return JSON.parse(JSON.stringify(initialState));
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
      const exitDirections = Object.keys(exits).filter((dir) => exits[dir]);
      const monster = monstersByRoomId[targetRoom.id] ?? null;
      const noLockedExits = !monster || monster.sated;
      const lockedDirections = noLockedExits
        ? []
        : exitDirections.filter((d) => d !== DIRECTION_OPPOSITE[direction]);
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
    case "moveLevels": {
      const { currentRoom, levelId, visitedLevels } = state;
      const exitInfo = LEVEL_EXITS_BY_ROOM_ID[currentRoom.id] ?? {};
      const { exitToLevelId, exitToRoomId } = exitInfo;
      if (!exitToLevelId) {
        console.info(`No exit level defined for ${currentRoom.id}`);
        return state;
      }
      if (!exitToRoomId) {
        console.info(`No exit roomID defined for ${currentRoom.id}`);
        return state;
      }

      return {
        ...state,
        levelId: exitToLevelId,
        previousLevelId: levelId,
        previousRoom: null,
        currentRoom: ROOMS_BY_ID[exitToRoomId],
        visitedLevels: uniq([...visitedLevels, exitToLevelId]),
      };
    }

    case "clearErrorMessage": {
      return {
        ...state,
        errorMessage: null,
      };
    }

    case "addToInventoryFromRoom": {
      const { itemId, quantity } = action.payload;
      const { inventoryById, itemsByRoomId, currentRoom } = state;
      const inventoryCount = Object.values(inventoryById).reduce(
        (a, b) => a + b,
        0
      );

      const currentRoomItemQuantity = itemsByRoomId[currentRoom.id][itemId];
      if (currentRoomItemQuantity < quantity) {
        console.info("Not enough items in room");
        return state;
      }
      if (inventoryCount + quantity > state.maxInventory) {
        console.info("Not enough room in inventory");
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
    case "addToRoomFromInventory": {
      const { itemId, quantity } = action.payload;
      const { inventoryById, itemsByRoomId, currentRoom } = state;

      const currentRoomItemQuantity = itemsByRoomId[currentRoom.id][itemId];
      const currentInventoryItemQuantity = inventoryById[itemId];
      const newInventoryItems = {
        ...inventoryById,
        [itemId]: currentInventoryItemQuantity - quantity,
      };

      const newCurrentRoomItems = {
        ...itemsByRoomId[currentRoom.id],
        [itemId]: currentRoomItemQuantity + quantity,
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
      const inventoryCount = Object.values(inventoryById).reduce(
        (a, b) => a + b,
        0
      );
      const roomItemCount = Object.values(currentRoomItemQuantities).reduce(
        (a, b) => a + b,
        0
      );
      if (inventoryCount + roomItemCount > state.maxInventory) {
        console.info("Not enough room in inventory");
        return state;
      }

      const newInventoryItems = zipObject(
        ITEM_IDS,
        ITEM_IDS.map(
          (itemId) => currentRoomItemQuantities[itemId] + inventoryById[itemId]
        )
      );

      const newCurrentRoomItems = zipObject(
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
      if (inventoryById[itemId] < 1) {
        console.info("not enough items in inventory");
        return state;
      }
      const newInventoryItems = {
        ...inventoryById,
        [itemId]: inventoryById[itemId] - 1,
      };
      if (value < monster.minimumItemValueAccepted) {
        console.info("item too weak");
        return {
          ...state,
          inventoryById: newInventoryItems,
          errorMessage: "*ineffectual*",
        };
      }
      const hunger = Math.max(monster.hunger - value, 0);
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

      if (newMonster.sated) {
        const haveKeysTo = [...state.haveKeysTo, hasKeyTo]
          .filter(Boolean)
          .sort();
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
    case "feedCaptive": {
      const { captiveId } = action.payload;
      const { currentRoom, captivesByRoomId, monstersByRoomId, haveKeysTo } =
        state;
      if (!captivesByRoomId[captiveId].freed) {
        console.info("captive not free");
        return state;
      }
      if (captivesByRoomId[captiveId].dead) {
        console.info("captive already dead");
        return state;
      }
      if (monstersByRoomId[currentRoom.id].sated) {
        console.info("monster is sated");
        return state;
      }
      return {
        ...state,
        captivesByRoomId: {
          ...captivesByRoomId,
          [captiveId]: {
            ...captivesByRoomId[captiveId],
            dead: true,
          },
        },
        monstersByRoomId: {
          ...monstersByRoomId,
          [currentRoom.id]: {
            ...monstersByRoomId[currentRoom.id],
            sated: true,
            hunger: 0,
            hasKeyTo: null,
          },
        },
        currentRoom: {
          ...currentRoom,
          lockedExitTilePositions: [],
          lockedDirections: [],
        },
        haveKeysTo: [...haveKeysTo, monstersByRoomId[currentRoom.id].hasKeyTo]
          .filter(Boolean)
          .sort(),
      };
    }
    case "freeCaptive": {
      const { captivesByRoomId, haveKeysTo } = state;
      const { roomId } = action.payload;
      const captive = captivesByRoomId[roomId];
      if (!haveKeysTo.includes(captive.id)) {
        console.info(`don't have key for ${roomId} captive ${captive.id}`);
        return state;
      }
      if (captive.freed) {
        console.info(`captive already freed`);
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
        learnedRecipeIds: [...state.learnedRecipeIds, captive.teaches].sort(),
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
      const updatedIngredientInventory = zipObject(
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
    case "toggleDebug": {
      return {
        ...state,
        debug: !state.debug,
      };
    }
    case "debugMoveToRoomId": {
      const { roomId } = action.payload;
      const { roomsById } = state;
      const room = roomsById[roomId];
      return {
        ...state,
        previousRoom: null,
        currentRoom: room,
      };
    }
    case "debugEndLevel": {
      const {
        levelId,
        captivesByRoomId,
        monstersByRoomId,
        itemsByRoomId,
        inventoryById,
        learnedRecipeIds,
        currentRoom,
        debug,
      } = state;

      if (!debug) {
        console.info("not in debug mode");
        return state;
      }

      const firstLevelExitRoomId = (
        Object.values(ROOMS_BY_ID).find(
          (room) =>
            room.levelId === levelId &&
            (room.type === ROOM_TYPES.exit ||
              room.type === ROOM_TYPES.finish) &&
            room.id !== currentRoom.id
        ) || {}
      ).id;
      if (!firstLevelExitRoomId) {
        console.info("no exit room found");
        return state;
      }

      const newLearnedRecipeIds = Object.values(
        pickBy(captivesByRoomId, (captive) => captive.levelId === levelId)
      ).map((captive) => captive.teaches);

      return {
        ...state,
        learnedRecipeIds: newLearnedRecipeIds,
        currentRoom: ROOMS_BY_ID[firstLevelExitRoomId],
        inventoryById: mapValues(inventoryById, (quantity, itemId) =>
          newLearnedRecipeIds.includes(itemId) ? 3 : 0
        ),
        previousRoom: null,
        captivesByRoomId: {
          ...captivesByRoomId,
          ...mapValues(
            pickBy(captivesByRoomId, (captive) => captive.levelId === levelId),
            (captive) => ({
              ...captive,
              freed: true,
              dead: false,
            })
          ),
        },
      };
    }
    case "debugGoToEndGame": {
      const {
        levelId,
        captivesByRoomId,
        monstersByRoomId,
        itemsByRoomId,
        inventoryById,
        learnedRecipeIds,
        currentRoom,
        debug,
      } = state;

      if (!debug) {
        console.info("not in debug mode");
        return state;
      }

      const newLearnedRecipeIds = Object.values(captivesByRoomId).map(
        (captive) => captive.teaches
      );

      return {
        ...state,
        learnedRecipeIds: newLearnedRecipeIds,
        previousLevelId: levelId,
        levelId: ROOMS_BY_ID["finish"].levelId,
        currentRoom: ROOMS_BY_ID["finish"],
        inventoryById: mapValues(inventoryById, (quantity, itemId) =>
          newLearnedRecipeIds.includes(itemId) ? 5 : 0
        ),
        previousRoom: null,
        captivesByRoomId: {
          ...captivesByRoomId,
          ...mapValues(
            pickBy(captivesByRoomId, (captive) => captive.levelId === levelId),
            (captive) => ({
              ...captive,
              freed: true,
              dead: false,
            })
          ),
        },
      };
    }
    default: {
      console.error("Unknown action: " + action);
      return state;
    }
  }
}
