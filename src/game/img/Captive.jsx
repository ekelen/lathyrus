import Rabbit from "./rabbit.svg";
import Tortoise from "./tortoise.svg";
import Cat from "./cat.svg";
import Toad from "./toad.svg";
import Rooster from "./rooster.svg";
import React from "react";
import SVG from "react-inlinesvg";

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
  color = captive.color,
}) {
  const source = GET_CAPTIVE_IMAGE(captive.image);

  return (
    <SVG
      src={source}
      width={width}
      height="auto"
      title="React"
      preProcessor={(code) => code.replace(/fill=".*?"/g, `fill="${color}"`)}
    />
  );
}
