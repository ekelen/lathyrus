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
      <div
        style={{
          height: "99vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignContent: "center",
          border: "1px solid #333",
        }}
      >
        <h2>Lathyrus</h2>
        <AppWrapper />
      </div>
    </GameContextProvider>
  );
}

export default App;
