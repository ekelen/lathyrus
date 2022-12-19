const setup = require("../src/data/setup");
const constants = require("../src/data/constants");
const util = require("../src/data/util");
const _ = require("lodash");

const {
  MONSTER_LIST,
  ROOMS_BY_ID,
  ITEMS_BY_ID,
  ROOM_POSITIONS,
  MAP_SIZE,
  CAPTIVE_LIST,
} = constants;

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
      _.keys(ROOMS_BY_ID).sort()
    );
  });
  test("All container items have keys that exist on map", () => {
    expect(
      _.keys(constants.CONTAINER_ITEMS).every((roomId) => {
        return ROOMS_BY_ID[roomId] && ROOMS_BY_ID[roomId].type === "container";
      })
    ).toBe(true);
  });
  test("All rooms have at least one exit", () => {
    expect(
      _.values(ROOMS_BY_ID).every((room) => {
        return _.compact(_.values(room.exits)).length > 0;
      })
    ).toBe(true);
  });
  test("All monsters must be in a room of type 'monster'", () => {
    expect(
      MONSTER_LIST.every((monster) => {
        return (
          ROOMS_BY_ID[monster.roomId].type === constants.ROOM_TYPES.monster
        );
      })
    ).toBe(true);
    expect(
      _.values(ROOMS_BY_ID)
        .filter((r) => r.type === constants.ROOM_TYPES.monster)
        .every((r) => MONSTER_LIST.find((m) => m.roomId === r.id))
    ).toBe(true);
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
      expect(MONSTER_LIST.find((m) => m.hasKeyTo === captive.id)).toBeTruthy();
    });
  });
  test("All monsters with keys have keys to a captive", () => {
    MONSTER_LIST.filter((m) => m.hasKeyTo).forEach((m) => {
      expect(CAPTIVE_LIST.find((c) => c.id === m.hasKeyTo)).toBeTruthy();
    });
  });
  test("Captives", () => {
    CAPTIVE_LIST.forEach((captive) => {
      expect(captive).toHaveProperty("id");
      expect(captive).toHaveProperty("roomId");
      expect(captive).toHaveProperty("name");

      expect(captive).toHaveProperty("image");
      expect(captive).toHaveProperty("freed");
      expect(captive).toHaveProperty("teaches");
    });
  });
  test("Container items", () => {
    _.entries(constants.CONTAINER_ITEMS).forEach(([roomId, items]) => {
      expect(ROOMS_BY_ID[roomId].type).toBe("container");
    });
    _.values(setup.initialState.itemsByRoomId)
      .flat()
      .forEach((itemsById) => {
        _.entries(itemsById).forEach(([id, item]) => {
          expect(item).toHaveProperty("id");
          expect(item).toHaveProperty("roomId");
          expect(ROOMS_BY_ID[item.roomId].type).toBe("container");
          expect(item).toHaveProperty("name");
          expect(item).toHaveProperty("type");
          expect(ITEMS_BY_ID[item.id]).toBeTruthy();
          expect(ITEMS_BY_ID[id]).toBeTruthy();
          expect(item).toHaveProperty("quantity");
        });
      });
  });
  test("Recipes", () => {
    _.entries(constants.RECIPES_BY_ID).forEach(([id, recipe]) => {
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
