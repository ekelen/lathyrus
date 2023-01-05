import React from "react";

export function Button({
  children,
  onClick = () => {},
  className = "",
  disabled = false,
  bgClassName = "bg-slate-800",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`whitespace-pre ${bgClassName} rounded-md border border-slate-800 transition-colors disabled:border-transparent flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}

export const UsableButton = ({
  children,
  onClick = () => {},
  className = "",
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`border-amber-600 ${className}`}
      children={children}
    ></Button>
  );
};
