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

const pickBy = (object, predicate) => {
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) => predicate(value, key))
  );
};

const pick = (object, keys) => {
  return pickBy(object, (value, key) => keys.includes(key));
};

const mapValues = (object, mapper) => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, mapper(value, key)])
  );
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
  mapValues,
  zipObject,
  pick,
  pickBy,
  CENTER_POSITION,
  ROOM_EXIT_POSITIONS,
};
