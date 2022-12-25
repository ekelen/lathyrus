const _ = require("lodash");
const { initialState } = require("../src/state/setup");
const { gameReducer } = require("../src/state/gameReducer");

const { ROOMS_BY_ID, ITEM_IDS } = require("../src/data/data");
const { ROOM_TYPES, DIRECTION_OPPOSITE } = require("../src/data/constants");

describe("actions", () => {
  test("reset is valid", () => {
    let gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID[Object.keys(ROOMS_BY_ID)[2]],
      previousRoom: ROOMS_BY_ID[Object.keys(ROOMS_BY_ID)[3]],
      inventoryById: {
        gold: 100,
        silver: 100,
      },
    };
    expect(JSON.stringify(gameState)).not.toEqual(JSON.stringify(initialState));
    gameState = gameReducer(gameState, { type: "reset" });
    expect(JSON.stringify(gameState)).toEqual(JSON.stringify(initialState));
    expect(gameState).toEqual(initialState);
  });
  test("move", () => {
    const result = gameReducer(initialState, {
      type: "move",
      payload: { direction: "south" },
    });
    expect(result.currentRoom.id).toEqual(result.previousRoom.exits.south);
    expect(result.previousRoom.id).toEqual(initialState.currentRoom.id);
    const result2 = gameReducer(result, {
      type: "move",
      payload: { direction: "north" },
    });
    expect(result2.currentRoom.id).toEqual(initialState.currentRoom.id);
    expect(result2.previousRoom.id).toEqual(
      initialState.currentRoom.exits.south
    );
  });
  test("move in locked room", () => {
    const getExitDirections = (room) => {
      const { exits } = room;
      return Object.keys(exits).filter((dir) => exits[dir]);
    };

    const exitDirections = getExitDirections(ROOMS_BY_ID["2_M"]);
    // start in neighboring room to one that locks
    let gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID[ROOMS_BY_ID["2_M"].exits[exitDirections[0]]],
    };
    // move successfully into locked room
    gameState = gameReducer(gameState, {
      type: "move",
      payload: { direction: DIRECTION_OPPOSITE[exitDirections[0]] },
    });
    expect(gameState.currentRoom.id).toEqual("2_M");
    expect(gameState.currentRoom.lockedDirections.length).toBeGreaterThan(0);
    // try to move in locked direction
    gameState = gameReducer(gameState, {
      type: "move",
      payload: { direction: gameState.currentRoom.lockedDirections[0] },
    });
    expect(gameState.currentRoom.id).toEqual("2_M");
    // move in unlocked direction
    gameState = gameReducer(gameState, {
      type: "move",
      payload: { direction: exitDirections[0] },
    });
    expect(gameState.currentRoom.id).toEqual(
      ROOMS_BY_ID["2_M"].exits[exitDirections[0]]
    );
  });

  test("sate monster", () => {
    let gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID["2_M"],
      inventoryById: {
        ...initialState.inventoryById,
        gold: 4,
      },
    };
    expect(gameState.currentRoom.id).toEqual("2_M");
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("sated", false);
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("maxHunger");
    expect(gameState.monstersByRoomId["2_M"].maxHunger).toBeGreaterThan(0);
    expect(gameState.monstersByRoomId["2_M"].hunger).toEqual(
      gameState.monstersByRoomId["2_M"].maxHunger
    );
    gameState = gameReducer(gameState, {
      type: "feed",
      payload: { itemId: "gold" },
    });
    expect(gameState.monstersByRoomId["2_M"].hunger).toBeLessThan(
      gameState.monstersByRoomId["2_M"].maxHunger
    );
    gameState = gameReducer(gameState, {
      type: "feed",
      payload: { itemId: "gold" },
    });
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("hunger", 0);
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("sated", true);
    // expect(gameState.currentRoom.lockedDirections).toHaveLength(0);
    // try to feed monster again
    gameState = gameReducer(gameState, {
      type: "feed",
      payload: { itemId: "gold" },
    });
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("sated", true);
  });
  test("feed captive to monster", () => {
    let gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID["5_M_TOAD"],
      captivesByRoomId: {
        ...initialState.captivesByRoomId,
        rabbit: {
          ...initialState.captivesByRoomId.rabbit,
          freed: true,
        },
      },
    };
    expect(gameState.captivesByRoomId["rabbit"]).toHaveProperty("dead", false);
    expect(gameState.monstersByRoomId["5_M_TOAD"]).toHaveProperty(
      "sated",
      false
    );
    gameState = gameReducer(gameState, {
      type: "feedCaptive",
      payload: { captiveId: "rabbit" },
    });
    expect(gameState.captivesByRoomId["rabbit"]).toHaveProperty("dead", true);
    expect(gameState.monstersByRoomId["5_M_TOAD"]).toHaveProperty(
      "sated",
      true
    );
    // Try to feed dead captive to monster
    gameState.currentRoom = ROOMS_BY_ID["2_M"];
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("sated", false);
    gameState = gameReducer(gameState, {
      type: "feedCaptive",
      payload: { captiveId: "rabbit" },
    });
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("sated", false);
    // Try to feed unfreed captive to monster
    gameState.currentRoom = ROOMS_BY_ID["2_M"];
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("sated", false);
    gameState = gameReducer(gameState, {
      type: "feedCaptive",
      payload: { captiveId: "toad" },
    });
    expect(gameState.monstersByRoomId["2_M"]).toHaveProperty("sated", false);
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
      inventoryById: {
        ...initialState.inventoryById,
        copper: 1,
        frostEssence: 1,
      },
    };
    expect(gameState.inventoryById.copper).toEqual(1);
    expect(gameState.inventoryById.frostFarthing).toEqual(0);
    gameState = gameReducer(gameState, {
      type: "combineItems",
      payload: { recipeId: "frostFarthing" },
    });
    expect(gameState.inventoryById.copper).toEqual(0);
    expect(gameState.inventoryById.frostEssence).toEqual(0);
    expect(gameState.inventoryById.frostFarthing).toEqual(1);
    // try to combine items without items
    gameReducer(gameState, {
      type: "combineItems",
      payload: { recipeId: "frostFarthing" },
    });
    expect(gameState.inventoryById.frostFarthing).toEqual(1);
    // try to combine items without recipe
    gameReducer(gameState, {
      type: "combineItems",
      payload: { recipeId: "gildedGroat" },
    });
    expect(gameState.inventoryById.gildedGroat).toEqual(0);
  });
  test("addAllToInventoryFromRoom", () => {
    let gameState = {
      ...initialState,
      currentRoom: ROOMS_BY_ID["1_C"],
      itemsByRoomId: {
        "1_C": {
          ..._.zipObject(ITEM_IDS, new Array(ITEM_IDS.length).fill(0)),
          gold: 1,
          copper: 1,
          frostEssence: 3,
        },
      },
    };
    expect(gameState.inventoryById.gold).toEqual(0);
    expect(gameState.inventoryById.copper).toEqual(0);
    expect(gameState.inventoryById.frostEssence).toEqual(0);
    expect(gameState.itemsByRoomId["1_C"].gold).toEqual(1);
    expect(gameState.itemsByRoomId["1_C"].frostEssence).toEqual(3);
    expect(gameState.currentRoom.id).toEqual("1_C");
    gameState = gameReducer(gameState, {
      type: "addAllToInventoryFromRoom",
    });
    expect(gameState.inventoryById.gold).toEqual(1);
    expect(gameState.inventoryById.copper).toEqual(1);
    expect(gameState.inventoryById.frostEssence).toEqual(3);
    expect(gameState.itemsByRoomId["1_C"].gold).toEqual(0);
    expect(gameState.itemsByRoomId["1_C"].frostEssence).toEqual(0);
  });
});
