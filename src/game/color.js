import { linearGradient } from "polished";
import { MAP_SIZE } from "../data/setup";
import _ from "lodash";
import { lighten } from "polished";

const bottom = "#000000";

const toDirection = "to bottom";
const fallback = "#000000";

export const rowGradients = _.range(MAP_SIZE).map((row) => {
  return linearGradient({
    colorStops: [
      lighten((row * 0.75) / MAP_SIZE, bottom),
      lighten(((row + 1) * 0.75) / MAP_SIZE, bottom),
    ],
    toDirection,
    fallback,
  });
});

export const getRoomGradient = (y) => {
  return rowGradients[y];
};
