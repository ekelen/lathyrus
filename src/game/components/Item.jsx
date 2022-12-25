import React from "react";

export function Item({
  item = {},
  colorClass = item.colorClass,
  symbol = item.symbol,
}) {
  return (
    <div
      className={`h-6 w-6 relative flex items-center justify-center alchemy text-center text-sm ${colorClass}`}
    >
      {symbol}
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
      className={`flex items-center justify-center whitespace-pre pr-2 ${wrapperClass}`}
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
  onClick = () => {},
}) {
  return (
    <button
      className={`btn pr-2 mr-1 mb-1 disabled:bg-transparent ${wrapperClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Item item={item} colorClass={colorClass} />
      <div className="text-xs">x {quantity}</div>
    </button>
  );
}
