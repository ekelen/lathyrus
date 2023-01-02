import React from "react";
import { UsableButton } from "./Button";

export function Item({
  item = {},
  colorClass = item.colorClass,
  symbol = item.symbol,
  className = "",
}) {
  return (
    <div
      className={`h-6 w-6 relative flex items-center justify-center font-alchemy text-center text-sm ${colorClass} ${className}`}
    >
      {symbol}
    </div>
  );
}

export function ItemWithQuantity({
  item,
  quantity,
  colorClass = item.colorClass,
  className = "",
}) {
  return (
    <div
      className={`flex items-center justify-center whitespace-pre pr-2 ${className}`}
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
  className = "",
  disabled = false,
  onClick = () => {},
}) {
  return (
    <UsableButton
      className={`pr-2 mr-1 mb-1 disabled:bg-transparent ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Item item={item} colorClass={colorClass} />
      <div className="text-xs">x {quantity}</div>
    </UsableButton>
  );
}

export function ItemButton({
  item = {},
  symbol = item.symbol,
  colorClass = item.colorClass,
  className = "",
  disabled = false,
  onClick = () => {},
}) {
  return (
    <UsableButton
      className={`disabled:bg-transparent ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Item item={item} colorClass={colorClass} symbol={symbol} />
    </UsableButton>
  );
}
