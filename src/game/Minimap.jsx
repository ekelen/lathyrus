import React from "react";
import { ROOMS_BY_ID, ROOM_POSITIONS } from "../data/constants";
import { ModalContext, useGame } from "../state/GameContext";

function Minimap() {
  const { showModal, handleShowModal } = React.useContext(ModalContext);
  const { currentRoom } = useGame();
  const { coordinates } = currentRoom;
  return (
    <div
      className="flex flex-col w-96 h-96 relative items-center justify-center"
      onClick={() => handleShowModal(false)}
    >
      {ROOM_POSITIONS.map((row, y) => {
        return (
          <div key={y + "row"} className="flex items-center justify-center">
            {row.map((room, x) => {
              const backgroundClass = room ? "bg-slate-600" : "bg-black";
              return (
                <div
                  key={`room-${x}-${y}`}
                  className={`h-16 w-16 border border-black text-xs flex justify-end flex-col items-center text-black ${backgroundClass}`}
                >
                  {x === coordinates.x && y === coordinates.y && (
                    <div className="text-red-200 text-3xl">✯</div>
                  )}
                  <div>
                    {room
                      ? ROOMS_BY_ID[room].type.replace(/(storage|empty)/, "")
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Minimap;
