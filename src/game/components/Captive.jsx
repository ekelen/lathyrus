import Rabbit from "../img/rabbit.svg";
import Tortoise from "../img/tortoise.svg";
import Cat from "../img/cat.svg";
import Toad from "../img/toad.svg";
import Rooster from "../img/rooster.svg";
import React from "react";
import Svg from "./Svg";

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

export function CaptiveImage({
  captive,
  width = "100%",
  height = "80%",
  color = "currentColor",
  title = "Captive",
}) {
  const source = GET_CAPTIVE_IMAGE(captive.image);

  return (
    <Svg
      source={source}
      width={width}
      height={height}
      title={title}
      color={color}
    />
  );
}
