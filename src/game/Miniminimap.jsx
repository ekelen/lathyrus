import React from "react";
import { ROOMS_BY_ID, ROOM_POSITIONS } from "../data/data";
import { ModalContext, useGame } from "../state/GameContext";

function Miniminimap({ onClose = () => {} }) {
  const { currentRoom } = useGame();
  const { coordinates } = currentRoom;
  return (
    <div
      className="flex flex-col relative items-center justify-center border border-slate-600"
      onClick={onClose}
    >
      {ROOM_POSITIONS.map((row, y) => {
        return (
          <div key={y + "row"} className="flex items-center justify-center">
            {row.map((room, x) => {
              const backgroundClass = room ? "bg-teal-900" : "bg-black";
              return (
                <div
                  key={`room-${x}-${y}`}
                  className={`h-4 w-4 border border-black text-xs flex justify-center items-center flex-col text-black ${backgroundClass}`}
                >
                  {x === coordinates.x && y === coordinates.y && (
                    <div className="text-red-500">✯</div>
                  )}
                  <div></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Miniminimap;
