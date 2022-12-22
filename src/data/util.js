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

const ROOM_EXIT_POSITIONS = {
  north: getPositionFromCoordinates(1, 0),
  east: getPositionFromCoordinates(2, 1),
  south: getPositionFromCoordinates(1, 2),
  west: getPositionFromCoordinates(0, 1),
};

const CENTER_POSITION = getPositionFromCoordinates(1, 1);

export {
  sortByName,
  getCoordinatesFromPosition,
  getPositionFromCoordinates,
  CENTER_POSITION,
  ROOM_EXIT_POSITIONS,
};
