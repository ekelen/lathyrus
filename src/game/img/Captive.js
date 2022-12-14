import Rabbit from "./rabbit.svg";
import Tortoise from "./tortoise.svg";
import Cat from "./cat.svg";
import Toad from "./toad.svg";
import Rooster from "./rooster.svg";

export const GET_CAPTIVE_IMAGE = (image) => {
  switch (image) {
    case "rabbit": {
      return Rabbit;
    }
    case "tortoise": {
      return Tortoise;
    }
    case "cat": {
      return Cat;
    }
    case "toad": {
      return Toad;
    }
    case "rooster": {
      return Rooster;
    }
    default: {
      return null;
    }
  }
};
