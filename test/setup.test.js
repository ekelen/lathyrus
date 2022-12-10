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
        return ROOMS[monster.roomId].type === "monster";
      })
    ).toBe(true);
    expect(
      _.values(ROOMS)
        .filter((r) => r.type === "monster")
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
    expect(
      CAPTIVES.every((captive) => {
        return MONSTERS.find((m) => m.hasKeyTo === captive.id);
      })
    ).toBe(true);
  });
  test("All monsters with keys have keys to a captive", () => {
    expect(
      MONSTERS.filter((m) => m.hasKeyTo).every((m) => {
        return CAPTIVES.find((c) => c.id === m.hasKeyTo);
      })
    ).toBe(true);
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
