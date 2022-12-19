import React from "react";

export function Item({ item, colorClass = item.colorClass }) {
  return (
    <div
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

export function ItemWithQuantity({
  item,
  quantity,
  colorClass = item.colorClass,
  wrapperClass = "",
}) {
  return (
    <div
      className={`flex items-center justify-center whitespace-pre ${wrapperClass}`}
    >
      <Item item={item} colorClass={colorClass} />
      <div className="text-xs">x {quantity}</div>
    </div>
  );
}

export function ItemWithQuantityButton({
  item,
  quantity,
  colorClass = item.colorClass,
  wrapperClass = "",
  disabled = false,
  onClick,
}) {
  return (
    <button
      className={`flex items-center justify-center whitespace-pre ${wrapperClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Item item={item} colorClass={colorClass} />
      <div className="text-xs">x {quantity}</div>
    </button>
  );
}
