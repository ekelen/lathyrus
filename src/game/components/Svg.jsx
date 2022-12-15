import React from "react";
import SVG from "react-inlinesvg";

export default function Svg({
  source,
  width = "100%",
  height = width,
  color = "currentColor",
  title = "Image",
}) {
  return (
    <SVG
      src={source}
      width={width}
      height={height}
      title={title}
      preProcessor={(code) => code.replace(/fill=".*?"/g, `fill="${color}"`)}
    />
  );
}