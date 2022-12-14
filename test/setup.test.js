const setup = require("../src/data/setup");
const constants = require("../src/data/constants");
const util = require("../src/data/util");
const _ = require("lodash");

const { MONSTERS, ROOMS, ITEMS, ROOM_POSITIONS, MAP_SIZE, CAPTIVES } =
  constants;

describe("ROOM_POSITIONS and ROOMS", () => {
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
      _.keys(ROOMS).sort()
    );
  });
  test("All container items have keys that exist on map", () => {
    expect(
      _.keys(constants.CONTAINER_ITEMS).every((roomId) => {
        return ROOMS[roomId] && ROOMS[roomId].type === "container";
      })
    ).toBe(true);
  });
  test("All rooms have at least one exit", () => {
    expect(
      _.values(ROOMS).every((room) => {
        return _.compact(_.values(room.exits)).length > 0;
      })
    ).toBe(true);
  });
  test("All monsters must be in a room of type 'monster'", () => {
    expect(
      MONSTERS.every((monster) => {
        return ROOMS[monster.roomId].type === constants.ROOM_TYPES.monster;
      })
    ).toBe(true);
    expect(
      _.values(ROOMS)
        .filter((r) => r.type === constants.ROOM_TYPES.monster)
        .every((r) => MONSTERS.find((m) => m.roomId === r.id))
    ).toBe(true);
  });
  test("All captives must be in a room of type 'captive'", () => {
    expect(
      CAPTIVES.every((captive) => {
        return ROOMS[captive.roomId].type === "captive";
      })
    ).toBe(true);
  });
  test("All captives must have a monster with key", () => {
    CAPTIVES.forEach((captive) => {
      expect(MONSTERS.find((m) => m.hasKeyTo === captive.id)).toBeTruthy();
    });
  });
  test("All monsters with keys have keys to a captive", () => {
    MONSTERS.filter((m) => m.hasKeyTo).forEach((m) => {
      expect(CAPTIVES.find((c) => c.id === m.hasKeyTo)).toBeTruthy();
    });
  });
  test("Captives", () => {
    CAPTIVES.forEach((captive) => {
      expect(captive).toHaveProperty("id");
      expect(captive).toHaveProperty("roomId");
      expect(captive).toHaveProperty("name");

      expect(captive).toHaveProperty("image");
      expect(captive).toHaveProperty("freed");
      expect(captive).toHaveProperty("teaches");
    });
  });
  test("Recipes", () => {
    _.entries(constants.RECIPES).forEach(([id, recipe]) => {
      expect(
        CAPTIVES.find((c) => {
          return c.teaches.recipeId === id;
        })
      ).toBeTruthy();
      expect(recipe).toHaveProperty("name");
      expect(recipe).toHaveProperty("ingredients");
      expect(recipe.ingredients.every((i) => ITEMS[i.itemId])).toBe(true);
    });
  });
});

describe("initialData", () => {
  test("initialData is valid", () => {
    const { initialState } = setup;
    expect(initialState).toHaveProperty("currentRoom");
    expect(initialState).toHaveProperty("previousRoom");
    expect(initialState).toHaveProperty("roomItems");
    expect(initialState).toHaveProperty("roomMonsters");
    expect(initialState).toHaveProperty("movedCameraToOnTransition");
    expect(initialState).toHaveProperty("inventory");
    expect(initialState).toHaveProperty("captives");
    expect(initialState).toHaveProperty("haveKeysTo");
  });
});
