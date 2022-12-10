import _ from "lodash";
import { ROOM_SIZE } from "./constants";

const sortByName = (collection = []) => _.sortBy(collection, "name");

const getPositionFromCoordinates = (x, y) => {
  return y * ROOM_SIZE + x;
};

const getCoordinatesFromPosition = (position) => {
  return {
    x: position % ROOM_SIZE,
    y: Math.floor(position / ROOM_SIZE),
  };
};

export { sortByName, getCoordinatesFromPosition, getPositionFromCoordinates };
