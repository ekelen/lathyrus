const _ = require("lodash");
const { initialState } = require("../src/data/setup");
const { gameReducer } = require("../src/state/gameReducer");

const {
  ROOMS_BY_ID,
  ROOM_POSITIONS,
  MAP_SIZE,
  ROOM_TYPES,
} = require("../src/data/constants");

describe("reset", () => {
  test("reset is valid", () => {
    const gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID[_.keys(ROOMS_BY_ID)[2]],
      previousRoom: ROOMS_BY_ID[_.keys(ROOMS_BY_ID)[3]],
    };
    const result = gameReducer(gameState, { type: "reset" });
    expect(JSON.stringify(result)).toEqual(JSON.stringify(initialState));
    expect(result).toEqual(initialState);
  });
  test("move", () => {
    const result = gameReducer(initialState, {
      type: "move",
      payload: { direction: "south" },
    });
    expect(result.currentRoom.id).toEqual("1_LAB");
    expect(result.previousRoom.id).toEqual(initialState.currentRoom.id);
    const result2 = gameReducer(result, {
      type: "move",
      payload: { direction: "north" },
    });
    expect(result2.currentRoom.id).toEqual("0_C");
    expect(result2.previousRoom.id).toEqual("1_LAB");
  });
  test("move in locked room", () => {
    const gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID["1_LAB"],
    };
    const result = gameReducer(gameState, {
      type: "move",
      payload: { direction: "east" },
    });
    expect(result.currentRoom.id).toEqual("2_M");
    expect(result.currentRoom.type).toEqual(ROOM_TYPES.monster);
    expect(result.previousRoom.id).toEqual("1_LAB");
    expect(result.currentRoom.lockedDirections).toEqual(["south", "east"]);
  });
  test("updateInventoryQuantity", () => {
    let gameState = gameReducer(initialState, {
      type: "updateInventoryQuantity",
      payload: { itemId: "gold", quantity: 1 },
    });
    let goldItem = gameState.inventoryById["gold"];
    expect(goldItem).toHaveProperty("quantity", 1);
    expect(goldItem).toHaveProperty("id", "gold");
    expect(goldItem).toHaveProperty("name", "Gold");
    expect(goldItem).toHaveProperty("value", 2);
    gameState = gameReducer(gameState, {
      type: "updateInventoryQuantity",
      payload: { itemId: "gold", quantity: -1 },
    });
    goldItem = gameState.inventoryById["gold"];
    expect(goldItem).toHaveProperty("quantity", 0);
  });
  test("sate monster", () => {
    const gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID["1_LAB"],
    };
    const result = gameReducer(gameState, {
      type: "move",
      payload: { direction: "east" },
    });
    expect(result.currentRoom.id).toEqual("2_M");
    expect(result.previousRoom.id).toEqual("1_LAB");
    expect(result.monstersByRoomId["2_M"]).toHaveProperty("sated", false);
    expect(result.monstersByRoomId["2_M"]).toHaveProperty("maxHunger");
    expect(result.monstersByRoomId["2_M"].maxHunger).toEqual(4);
    expect(result.monstersByRoomId["2_M"].hunger).toEqual(
      result.monstersByRoomId["2_M"].maxHunger
    );
    let fedMonsterResult = gameReducer(result, {
      type: "feed",
      payload: { itemId: "gold" },
    });
    expect(fedMonsterResult.monstersByRoomId["2_M"].hunger).toBeLessThan(
      result.monstersByRoomId["2_M"].maxHunger
    );
    fedMonsterResult = gameReducer(fedMonsterResult, {
      type: "feed",
      payload: { itemId: "gold" },
    });
    expect(fedMonsterResult.monstersByRoomId["2_M"]).toHaveProperty(
      "hunger",
      0
    );
    expect(fedMonsterResult.monstersByRoomId["2_M"]).toHaveProperty(
      "sated",
      true
    );
    expect(fedMonsterResult.currentRoom.lockedDirections).toHaveLength(0);
  });
  test("freeCaptive", () => {
    let gameState = {
      ...initialState,
      haveKeysTo: [],
      currentRoom: ROOMS_BY_ID["rabbit"],
    };
    expect(gameState.captivesByRoomId["rabbit"]).toHaveProperty("freed", false);
    expect(gameState.learnedRecipeIds).toHaveLength(0);
    // try to free captive without key
    gameState = gameReducer(gameState, {
      type: "freeCaptive",
      payload: { roomId: "rabbit" },
    });
    expect(gameState.captivesByRoomId["rabbit"]).toHaveProperty("freed", false);
    expect(gameState.learnedRecipeIds).toHaveLength(0);

    gameState = {
      ...gameState,
      haveKeysTo: ["rabbit"],
      currentRoom: ROOMS_BY_ID["rabbit"],
    };
    gameState = gameReducer(gameState, {
      type: "freeCaptive",
      payload: { roomId: "rabbit" },
    });
    expect(gameState.captivesByRoomId["rabbit"]).toHaveProperty("freed", true);
    expect(gameState.learnedRecipeIds).toHaveLength(1);
    expect(gameState.learnedRecipeIds).toContain("frostFarthing");
  });
  test("combineItems", () => {
    let gameState = {
      ...initialState,
      learnedRecipeIds: ["frostFarthing"],
    };
    gameState = gameReducer(gameState, {
      type: "updateInventoryQuantity",
      payload: { itemId: "tin", quantity: 1 },
    });
    gameState = gameReducer(gameState, {
      type: "updateInventoryQuantity",
      payload: { itemId: "frostEssence", quantity: 1 },
    });
    expect(gameState.inventoryById.tin).toHaveProperty("quantity", 1);
    expect(gameState.inventoryById.frostFarthing).toHaveProperty("quantity", 0);
    gameState = gameReducer(gameState, {
      type: "combineItems",
      payload: { recipeId: "frostFarthing" },
    });
    expect(gameState.inventoryById.tin).toHaveProperty("quantity", 0);
    expect(gameState.inventoryById.frostEssence).toHaveProperty("quantity", 0);
    expect(gameState.inventoryById.frostFarthing).toHaveProperty("quantity", 1);
    // try to combine items without items
    gameReducer(gameState, {
      type: "combineItems",
      payload: { recipeId: "frostFarthing" },
    });
    expect(gameState.inventoryById.frostFarthing).toHaveProperty("quantity", 1);
    // try to combine items without recipe
    gameReducer(gameState, {
      type: "combineItems",
      payload: { recipeId: "gildedGroat" },
    });
    expect(gameState.inventoryById.gildedGroat).toHaveProperty("quantity", 0);
  });
  test("addAllToInventoryFromRoom", () => {
    let gameState = {
      ...initialState,
    };
    expect(gameState.inventoryById.gold).toHaveProperty("quantity", 0);
    expect(gameState.inventoryById.tin).toHaveProperty("quantity", 0);
    expect(gameState.inventoryById.frostEssence).toHaveProperty("quantity", 0);
    expect(gameState.itemsByRoomId["0_C"].gold.quantity).toEqual(1);
    expect(gameState.itemsByRoomId["0_C"].frostEssence.quantity).toEqual(3);
    gameState = gameReducer(gameState, {
      type: "addAllToInventoryFromRoom",
    });
    expect(gameState.inventoryById.gold).toHaveProperty("quantity", 1);
    expect(gameState.inventoryById.tin).toHaveProperty("quantity", 1);
    expect(gameState.inventoryById.frostEssence).toHaveProperty("quantity", 3);
    expect(gameState.itemsByRoomId["0_C"].gold.quantity).toEqual(0);
    expect(gameState.itemsByRoomId["0_C"].frostEssence.quantity).toEqual(0);
  });
});
