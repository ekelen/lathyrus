import React from "react";
import { ModalContext, useGame, useGameDispatch } from "../state/GameContext";
import { Button } from "./components/Button";
import Modal from "./components/Modal";
import Intro from "./Intro";
import Inventory from "./Inventory";
import Minimap from "./Minimap";
import RoomFrame from "./Room";
import Compass from "./img/compass.svg";
import Svg from "./components/Svg";
import EndGame from "./EndGame";

function Game() {
  const dispatch = useGameDispatch();
  const { debug, currentRoom } = useGame();
  const { showModal, handleShowModal } = React.useContext(ModalContext);
  const [showMiniModal, setShowMiniModal] = React.useState(false);
  return (
    <div
      className="flex flex-col h-full"
      style={{
        width: "clamp(350px, 95vw, 450px)",
        minWidth: "clamp(350px, 95vw, 450px)",
      }}
    >
      <div className="flex items-center justify-between mt-3">
        <div className="text-2xl text-slate-500 leading-none relative tracking-widest">
          <span>L</span>
          <span className="font-alchemy">&#x1f753;</span>TH
          <span className="font-alchemy">&#x1f756;</span>R
          <span className="font-alchemy">&#x1f709;</span>S
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-black opacity-50 z-10 " />
        </div>

        <div className="flex gap-2 text-sm">
          <Button
            onClick={() => {
              dispatch({ type: "toggleDebug" });
            }}
            className="px-2 py-1"
          >
            &lt;/&gt;
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "reset" });
            }}
            className="px-2 py-1"
          >
            Reset
          </Button>
        </div>
      </div>
      {debug && (
        <div className="flex items-center justify-between mt-3 absolute top-10 z-20">
          <div className="flex gap-2 text-sm">
            <Button
              onClick={() => {
                dispatch({ type: "debugEndLevel" });
              }}
              className="px-2 py-1"
            >
              End Level
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: "debugGoToEndGame" });
              }}
              className="px-2 py-1"
            >
              Go to End Game
            </Button>
          </div>
        </div>
      )}
      <RoomFrame />
      <div className="flex items-end justify-end text-sm relative portrait:h-24 landscape:h-auto mt-2">
        <Button
          className="h-6 w-6 p-0.5"
          onClick={() => {
            setShowMiniModal((o) => !o);
          }}
        >
          <Svg source={Compass} />
        </Button>
        {showMiniModal && (
          <div className="absolute z-50 bottom-0 right-0">
            <Minimap onClose={() => setShowMiniModal(false)} />
          </div>
        )}
      </div>
      <Inventory />

      {showModal &&
        (currentRoom.id === "0_C" ? (
          <Modal onClose={() => handleShowModal(false)}>
            <Intro />
          </Modal>
        ) : currentRoom.id === "finish" ? (
          <Modal onClose={() => {}}>
            <EndGame />
          </Modal>
        ) : null)}
    </div>
  );
}

export default Game;
