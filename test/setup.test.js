const setup = require("../src/state/setup");
const gameData = require("../src/data/data");
const _ = require("lodash");
const { ROOM_TYPES } = require("../src/data/constants");
const { levels } = require("../src/data/levels");
const { ITEMS_BY_ID, ROOMS_BY_ID, MAP_SIZE, CAPTIVE_LIST } = gameData;
const { level00, level01 } = levels;

describe("Base data and initial state", () => {
  const LEVEL_CONTAINER_ITEMS = {
    ...level00.LEVEL_CONTAINER_ITEMS,
    ...level01.LEVEL_CONTAINER_ITEMS,
  };
  const LEVEL_BASE_MONSTER_LIST = [
    ...level00.LEVEL_BASE_MONSTER_LIST,
    ...level01.LEVEL_BASE_MONSTER_LIST,
  ];
  test("LEVEL_ROOM_POSITIONS size is valid", () => {
    expect(level00.LEVEL_ROOM_POSITIONS).toHaveLength(MAP_SIZE);
    expect(level01.LEVEL_ROOM_POSITIONS).toHaveLength(MAP_SIZE);
    level00.LEVEL_ROOM_POSITIONS.forEach((row) => {
      expect(row).toHaveLength(MAP_SIZE);
    });
    level01.LEVEL_ROOM_POSITIONS.forEach((row) => {
      expect(row).toHaveLength(MAP_SIZE);
    });
  });
  test("No room positions are duplicated", () => {
    _.compact(
      _.uniq(
        _.flatMap([
          ...level00.LEVEL_ROOM_POSITIONS,
          ...level01.LEVEL_ROOM_POSITIONS,
        ])
      )
    ).length ===
      _.compact(
        _.flatMap([
          ...level00.LEVEL_ROOM_POSITIONS,
          ...level01.LEVEL_ROOM_POSITIONS,
        ])
      );
  });
  test("No room Ids are missing from LEVEL_ROOM_POSITIONS and vice versa", () => {
    expect(
      _.compact(
        _.uniq(
          _.flatMap([
            ...level00.LEVEL_ROOM_POSITIONS,
            ...level01.LEVEL_ROOM_POSITIONS,
          ])
        )
      ).sort()
    ).toEqual(Object.keys(gameData.ROOMS_BY_ID).sort());
  });
  test("All container items have keys that exist on map", () => {
    expect(
      Object.keys(level00.LEVEL_CONTAINER_ITEMS).every((roomId) => {
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
  test("All levels have a valid exit to another level", () => {
    const LEVEL_EXITS_BY_ROOM_ID = {
      ...level00.LEVEL_EXITS_BY_ROOM_ID,
      ...level01.LEVEL_EXITS_BY_ROOM_ID,
    };
    const levelIds = _.keys(levels);

    _.entries(LEVEL_EXITS_BY_ROOM_ID).forEach(([roomId, exit]) => {
      expect(ROOMS_BY_ID[roomId]).toBeDefined();
      expect(ROOMS_BY_ID[roomId].type).toBe(ROOM_TYPES.exit);
      expect(exit.exitToLevelId).toBeDefined();
      expect(exit.exitToCoordinates).toBeDefined();
      expect(exit.exitToRoomId).toBeDefined();
      const exitRoom = ROOMS_BY_ID[exit.exitToRoomId];
      expect(exitRoom).toBeDefined();
      expect(exitRoom.type).toBe(ROOM_TYPES.exit);
      expect(exitRoom.coordinates).toEqual(exit.exitToCoordinates);
      expect(levelIds).toContain(exit.exitToLevelId);
    });
  });
  test("Item list", () => {
    expect(Object.keys(ITEMS_BY_ID).length).toBeGreaterThan(0);
    expect(Object.keys(ITEMS_BY_ID).length).toBeLessThan(100);
    Object.values(ITEMS_BY_ID).forEach((item) => {
      expect(item).toHaveProperty("id");
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
        LEVEL_BASE_MONSTER_LIST.find((m) => m.hasKeyTo === captive.id)
      ).toBeTruthy();
      expect(ROOMS_BY_ID[captive.roomId].type).toBe(ROOM_TYPES.captive);
    });
  });
  test("Monsters", () => {
    const monsterList = [
      ...level00.LEVEL_BASE_MONSTER_LIST,
      ...level01.LEVEL_BASE_MONSTER_LIST,
    ];
    const monsterRooms = _.values(gameData.ROOMS_BY_ID).filter(
      (r) => r.type === ROOM_TYPES.monster
    );
    expect(monsterRooms.length).toEqual(monsterList.length);
    monsterRooms.forEach((room) => {
      expect(monsterList.find((m) => m.roomId === room.id)).toBeTruthy();
    });

    monsterList.forEach((monster) => {
      expect(monster).toHaveProperty("roomId");
      expect(monster).toHaveProperty("image");
      expect(monster).toHaveProperty("maxHunger");
      expect(Math.log2(monster.maxHunger) % 1).toBe(0);
      expect(Math.log2(monster.maxHunger)).toBeGreaterThan(0);
      expect(Math.log2(monster.maxHunger)).toBeLessThan(10);
      expect(ROOMS_BY_ID[monster.roomId].type).toBe(ROOM_TYPES.monster);
      expect(gameData.LEVEL_MONSTERS_BY_ROOM_ID[monster.roomId]).toBeTruthy();
    });
    monsterList
      .filter((m) => m.hasKeyTo)
      .forEach((m) => {
        expect(gameData.CAPTIVES_BY_ID[m.hasKeyTo]).toBeTruthy();
      });
  });
  test("Captives", () => {
    CAPTIVE_LIST.forEach((captive) => {
      expect(captive).toHaveProperty("id");
      expect(captive).toHaveProperty("roomId");
      expect(ROOMS_BY_ID[captive.id].type).toBe(ROOM_TYPES.captive);
      expect(captive).toHaveProperty("image");
      expect(captive).toHaveProperty("freed");
      expect(captive).toHaveProperty("dead");
      expect(captive).toHaveProperty("teaches");
    });
  });
  test("Container items", () => {
    const LEVEL_CONTAINER_ITEMS = {
      ...level00.LEVEL_CONTAINER_ITEMS,
      ...level01.LEVEL_CONTAINER_ITEMS,
    };
    _.entries(LEVEL_CONTAINER_ITEMS).forEach(([roomId, items]) => {
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
          return c.teaches;
        })
      ).toBeTruthy();
      expect(recipe).toHaveProperty("id");
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
    expect(initialState).toHaveProperty("levelId");
  });
});

{
  /* <div className="font-alchemy">
        e000:  e001:  e002:  e003:  e004:  e005:  e006:  e007:  e008: 
        e009:  e00a:  e00b:  e00c:  e00d:  e00e:  e00f:  e010:  e011: 
        e012:  e013:  e014:  e015:  e016:  e017:  e018:  e019:  e01a: 
        e01b:  e01c:  e01d:  e01e:  e01f:  e020:  e021:  e022:  e023: 
        e024:  e025:  e026:  e027:  e028:  e029:  e02a:  e02b:  e02c: 
        e02d:  e02e:  e02f:  e030:  e031:  e032:  e033:  e034:  e035: 
        e036:  e037:  e038:  e039:  e03a:  e03b:  e03c:  e03d:  e03e: 
        e03f:  e040:  e041:  e042:  e043:  e044:  e045:  e046:  e047: 
        e048:  e049:  e04a:  e04b:  e04c:  e04d:  e04e:  e04f:  e050: 
        e051:  e052:  e053:  e054:  e055:  e056:  e057:  e058:  e059: 
        e05a:  e05b:  e05c:  e05d:  e05e:  e05f:  e060:  e061:  e062: 
        e063:  e064:  e065:  e066:  e067:  e068:  e069:  e06a:  e06b: 
        e06c:  e06d:  e06e:  1f700: 🜀 1f701: 🜁 1f702: 🜂 1f703: 🜃 1f704: 🜄
        1f705: 🜅 1f706: 🜆 1f707: 🜇 1f708: 🜈 1f709: 🜉 1f70a: 🜊 1f70b: 🜋 1f70c: 🜌
        1f70d: 🜍 1f70e: 🜎 1f70f: 🜏 1f710: 🜐 1f711: 🜑 1f712: 🜒 1f713: 🜓 1f714: 🜔
        1f715: 🜕 1f716: 🜖 1f717: 🜗 1f718: 🜘 1f719: 🜙 1f71a: 🜚 1f71b: 🜛 1f71c: 🜜
        1f71d: 🜝 1f71e: 🜞 1f71f: 🜟 1f720: 🜠 1f721: 🜡 1f722: 🜢 1f723: 🜣 1f724: 🜤
        1f725: 🜥 1f726: 🜦 1f727: 🜧 1f728: 🜨 1f729: 🜩 1f72a: 🜪 1f72b: 🜫 1f72c: 🜬
        1f72d: 🜭 1f72e: 🜮 1f72f: 🜯 1f730: 🜰 1f731: 🜱 1f732: 🜲 1f733: 🜳 1f734: 🜴
        1f735: 🜵 1f736: 🜶 1f737: 🜷 1f738: 🜸 1f739: 🜹 1f73a: 🜺 1f73b: 🜻 1f73c: 🜼
        1f73d: 🜽 1f73e: 🜾 1f73f: 🜿 1f740: 🝀 1f741: 🝁 1f742: 🝂 1f743: 🝃 1f744: 🝄
        1f745: 🝅 1f746: 🝆 1f747: 🝇 1f748: 🝈 1f749: 🝉 1f74a: 🝊 1f74b: 🝋 1f74c: 🝌
        1f74d: 🝍 1f74e: 🝎 1f74f: 🝏 1f750: 🝐 1f751: 🝑 1f752: 🝒 1f753: 🝓 1f754: 🝔
        1f755: 🝕 1f756: 🝖 1f757: 🝗 1f758: 🝘 1f759: 🝙 1f75a: 🝚 1f75b: 🝛 1f75c: 🝜
        1f75d: 🝝 1f75e: 🝞 1f75f: 🝟 1f760: 🝠 1f761: 🝡 1f762: 🝢 1f763: 🝣 1f764: 🝤
        1f765: 🝥 1f766: 🝦 1f767: 🝧 1f768: 🝨 1f769: 🝩 1f76a: 🝪 1f76b: 🝫 1f76c: 🝬
        1f76d: 🝭 1f76e: 🝮 1f76f: 🝯 1f770: 🝰 1f771: 🝱 1f772: 🝲 1f773: 🝳 1f774: 🝴
        1f775: 🝵 1f776: 🝶 1f777: 🝷 1f778: 🝸 1f779: 🝹 1f77a: 🝺 1f77b: 🝻 1f77c: 🝼
        1f77d: 🝽 1f77e: 🝾 1f77f: 🝿
      </div> */
}
