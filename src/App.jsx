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
        placeContent: "center",
        border: "3px dashed pink",
        // position: "relative",
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
          justifyContent: "center",
          alignContent: "center",
          border: "1px solid red",
        }}
      >
        <h2>Lathyrus</h2>
        <AppWrapper />
      </div>
    </GameContextProvider>
  );
}

export default App;
