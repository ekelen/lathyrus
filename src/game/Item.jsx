// import { darken } from "polished";
import React from "react";
import { BLACK, WHITE } from "./color";

export function Item({ item }) {
  return (
    <div
      className="h-6 w-6 rounded-full border border-solid relative flex items-center justify-center"
      style={{
        borderColor: item.type === "coin" ? `${BLACK}` : `${BLACK}`,
        // color: item.type === "coin" ? `${darken(0.2, "yellow")}` : `${WHITE}`,
        color: "white",
      }}
    >
      <div className="alchemy table-cell align-middle text-center text-sm h-full w-full leading-6">
        {item.symbol}
      </div>
    </div>
  );
}
