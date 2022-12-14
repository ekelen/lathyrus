import Goblin from "./goblin.svg";

export const GET_MONSTER_IMAGE = (image) => {
  switch (image) {
    case "goblin": {
      return Goblin;
    }
    default: {
      return null;
    }
  }
};
