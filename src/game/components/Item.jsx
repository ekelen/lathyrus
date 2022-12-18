import React from "react";

export function Item({ item, colorClass = item.colorClass }) {
  return (
    <div
      // title={item.name}
      className={`h-6 w-6 relative flex items-center justify-center ${colorClass}`}
    >
      <div className="table-row">
        <div className="alchemy table-cell align-middle text-center text-sm h-full w-full leading-6">
          {item.symbol}
        </div>
      </div>
    </div>
  );
}
