import React from "react";
import { useGame, useGameDispatch } from "../state/GameContext";
import Inventory from "./Inventory";
import RoomFrame from "./Room";

function Game() {
  const { currentRoom } = useGame();
  const dispatch = useGameDispatch();
  return (
    <div
      className="flex flex-col h-100"
      style={{
        width: "clamp(350px, 95vw, 450px)",
        // border: "1px solid #333",
      }}
    >
      <div className="flex items-center justify-between">
        <h3>{currentRoom.name}</h3>
        {/* <h1 className="text-xl">
          &#128794;<span className="alchemy">&#128794;</span>
        </h1> */}

        <button
          onClick={() => {
            dispatch({ type: "reset" });
          }}
        >
          Reset
        </button>
      </div>
      <RoomFrame />
      <Inventory />
    </div>
  );
}

export default Game;
