import React from "react";
import Game from "./game/Game";
import GameContextProvider from "./state/GameContext";

function AppWrapper() {
  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        border: "3px dashed #333",
      }}
    >
      <Game />
    </div>
  );
}

function App() {
  return (
    <GameContextProvider>
      <div className="flex flex-col justify-center">
        <h2>Lathyrus</h2>
        <AppWrapper />
      </div>
    </GameContextProvider>
  );
}

export default App;
