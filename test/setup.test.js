const setup = require("../src/state/setup");
const gameData = require("../src/data/data");
const util = require("../src/data/util");
const _ = require("lodash");
const { ROOM_TYPES } = require("../src/data/constants");

const {
  BASE_MONSTER_LIST,
  ROOMS_BY_ID,
  ITEMS_BY_ID,
  ROOM_POSITIONS,
  MAP_SIZE,
  CAPTIVE_LIST,
  CAPTIVES_BY_ID,
} = gameData;

describe("ROOM_POSITIONS and ROOMS_BY_ID", () => {
  test("ROOM_POSITIONS size is valid", () => {
    expect(ROOM_POSITIONS).toHaveLength(MAP_SIZE);
    ROOM_POSITIONS.forEach((row) => {
      expect(row).toHaveLength(MAP_SIZE);
    });
  });
  test("No room positions are duplicated", () => {
    _.compact(_.uniq(_.flatMap(ROOM_POSITIONS))).length ===
      _.compact(_.flatMap(ROOM_POSITIONS)).length;
  });
  test("No room Ids are missing from ROOM_POSITIONS and vice versa", () => {
    expect(_.compact(_.uniq(_.flatMap(ROOM_POSITIONS))).sort()).toEqual(
      Object.keys(ROOMS_BY_ID).sort()
    );
  });
  test("All container items have keys that exist on map", () => {
    expect(
      Object.keys(gameData.CONTAINER_ITEMS).every((roomId) => {
        return ROOMS_BY_ID[roomId] && ROOMS_BY_ID[roomId].type === "container";
      })
    ).toBe(true);
  });
  test("All rooms have at least one exit", () => {
    expect(
      Object.values(ROOMS_BY_ID).every((room) => {
        return _.compact(Object.values(room.exits)).length > 0;
      })
    ).toBe(true);
  });
  test("Item list", () => {
    expect(Object.keys(ITEMS_BY_ID).length).toBeGreaterThan(0);
    expect(Object.keys(ITEMS_BY_ID).length).toBeLessThan(100);
    Object.values(ITEMS_BY_ID).forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(Math.log2(item.value) % 1).toBe(0);
      expect(Math.log2(item.value)).toBeLessThan(10);
    });
  });
  test("All captivesByRoomId must be in a room of type 'captive'", () => {
    expect(
      CAPTIVE_LIST.every((captive) => {
        return ROOMS_BY_ID[captive.roomId].type === "captive";
      })
    ).toBe(true);
  });
  test("All captivesByRoomId must have a monster with key", () => {
    CAPTIVE_LIST.forEach((captive) => {
      expect(
        BASE_MONSTER_LIST.find((m) => m.hasKeyTo === captive.id)
      ).toBeTruthy();
      expect(ROOMS_BY_ID[captive.roomId].type).toBe(ROOM_TYPES.captive);
    });
  });
  test("Base monster list", () => {
    BASE_MONSTER_LIST.forEach((monster) => {
      expect(monster).toHaveProperty("roomId");
      expect(monster).toHaveProperty("name");
      expect(monster).toHaveProperty("image");
      expect(monster).toHaveProperty("maxHunger");
      expect(Math.log2(monster.maxHunger) % 1).toBe(0);
      expect(Math.log2(monster.maxHunger)).toBeGreaterThan(0);
      expect(Math.log2(monster.maxHunger)).toBeLessThan(10);
      expect(ROOMS_BY_ID[monster.roomId].type).toBe(ROOM_TYPES.monster);
    });
    BASE_MONSTER_LIST.filter((m) => m.hasKeyTo).forEach((m) => {
      expect(gameData.CAPTIVES_BY_ID[m.hasKeyTo]).toBeTruthy();
    });
  });
  test("Captives", () => {
    CAPTIVE_LIST.forEach((captive) => {
      expect(captive).toHaveProperty("id");
      expect(captive).toHaveProperty("roomId");
      expect(ROOMS_BY_ID[captive.id].type).toBe(ROOM_TYPES.captive);
      expect(captive).toHaveProperty("name");
      expect(captive).toHaveProperty("image");
      expect(captive).toHaveProperty("freed");
      expect(captive).toHaveProperty("teaches");
    });
  });
  test("Container items", () => {
    _.entries(gameData.CONTAINER_ITEMS).forEach(([roomId, items]) => {
      expect(ROOMS_BY_ID[roomId].type).toBe("container");
    });
    _.toPairs(setup.initialState.itemsByRoomId).forEach(
      ([roomId, itemsById]) => {
        _.entries(itemsById).forEach(([id, quantity]) => {
          expect(ROOMS_BY_ID[roomId].type).toBe(ROOM_TYPES.container);
          expect(ITEMS_BY_ID[id]).toBeTruthy();
          expect(quantity).toBeGreaterThanOrEqual(0);
        });
      }
    );
  });
  test("Recipes", () => {
    _.entries(gameData.RECIPES_BY_ID).forEach(([id, recipe]) => {
      expect(
        CAPTIVE_LIST.find((c) => {
          return c.teaches.recipeId === id;
        })
      ).toBeTruthy();
      expect(recipe).toHaveProperty("name");
      expect(recipe).toHaveProperty("ingredients");
      expect(recipe.ingredients.every((i) => ITEMS_BY_ID[i.itemId])).toBe(true);
    });
  });
});

describe("initialData", () => {
  test("initialData is valid", () => {
    const { initialState } = setup;
    expect(initialState).toHaveProperty("currentRoom");
    expect(initialState).toHaveProperty("previousRoom");
    expect(initialState).toHaveProperty("itemsByRoomId");
    expect(initialState).toHaveProperty("monstersByRoomId");
    expect(initialState).toHaveProperty("movedCameraToOnTransition");
    expect(initialState).toHaveProperty("inventoryById");
    expect(initialState).toHaveProperty("captivesByRoomId");
    expect(initialState).toHaveProperty("haveKeysTo");
  });
});
