import goblin from "./goblin.svg";
import zombie from "./zombie.svg";

export const GET_MONSTER_IMAGE = (image) => {
  switch (image) {
    case "goblin": {
      return goblin;
    }
    case "zombie": {
      return zombie;
    }
    default: {
      return null;
    }
  }
};
