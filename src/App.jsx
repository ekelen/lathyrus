import React from "react";
import Game from "./game/Game";
import GameContextProvider from "./state/GameContext";

function App() {
  return (
    <GameContextProvider>
      <div className="flex flex-col justify-center h-screen max-h-screen items-center w-full">
        <Game />
      </div>
    </GameContextProvider>
  );
}

export default App;
