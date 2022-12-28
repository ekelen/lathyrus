import _ from "lodash";
import { ROOM_SIZE } from "./constants";

const getPositionFromCoordinates = (x, y) => {
  return y * ROOM_SIZE + x;
};

const getCoordinatesFromPosition = (position) => {
  return {
    x: position % ROOM_SIZE,
    y: Math.floor(position / ROOM_SIZE),
  };
};

const keyBy = (array, key) => {
  return Object.fromEntries(array.map((item) => [item[key], item]));
};

const zipObject = (keys, values) => {
  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
};

const ROOM_EXIT_POSITIONS = {
  north: getPositionFromCoordinates(1, 0),
  east: getPositionFromCoordinates(2, 1),
  south: getPositionFromCoordinates(1, 2),
  west: getPositionFromCoordinates(0, 1),
};

const CENTER_POSITION = getPositionFromCoordinates(1, 1);

export {
  getCoordinatesFromPosition,
  getPositionFromCoordinates,
  keyBy,
  zipObject,
  CENTER_POSITION,
  ROOM_EXIT_POSITIONS,
};
