import goblin from "./goblin.svg";
import zombie from "./zombie.svg";
import dragon from "./dragon.svg";

export const GET_MONSTER_IMAGE = (image) => {
  switch (image) {
    case "goblin": {
      return goblin;
    }
    case "zombie": {
      return zombie;
    }
    case "dragon": {
      return dragon;
    }
    default: {
      return null;
    }
  }
};
