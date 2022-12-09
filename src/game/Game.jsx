import React from "react";
import { useGame, useGameDispatch } from "../state/GameContext";
import Inventory from "./Inventory";
import RoomFrame from "./Room";

function Game() {
  const { currentRoom } = useGame();
  const dispatch = useGameDispatch();
  return (
    <div
      style={{
        width: "clamp(350px, 95vw, 450px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>{currentRoom.name}</h3>
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
