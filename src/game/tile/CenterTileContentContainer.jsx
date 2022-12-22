import React from "react";

export function CenterTileContentContainer({
  toggleOpen = () => {},
  children,
}) {
  return (
    <div
      className="flex items-center justify-center relative h-full w-full p-2"
      onClick={toggleOpen}
    >
      {children}
    </div>
  );
}
