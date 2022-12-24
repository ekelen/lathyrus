import React from "react";
import Game from "./game/Game";
import GameContextProvider from "./state/GameContext";

function AppWrapper() {
  return (
    <div className="flex justify-center items-start w-full p-4">
      <Game />
    </div>
  );
}

function App() {
  return (
    <GameContextProvider>
      <div className="flex flex-col justify-center">
        <AppWrapper />
      </div>
    </GameContextProvider>
  );
}

export default App;
