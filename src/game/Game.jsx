import React from "react";
import { ModalContext, useGame, useGameDispatch } from "../state/GameContext";
import Modal from "./components/Modal";
import Intro from "./Intro";
import Inventory from "./Inventory";
import Miniminimap from "./Miniminimap";
import RoomFrame from "./Room";

function Game() {
  const { currentRoom } = useGame();
  const dispatch = useGameDispatch();
  const { showModal, handleShowModal } = React.useContext(ModalContext);
  const [showMiniModal, setShowMiniModal] = React.useState(false);
  return (
    <div
      className="flex flex-col h-100"
      style={{
        width: "clamp(350px, 95vw, 450px)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3></h3>

        <div className="flex gap-2 text-sm text-slate-400">
          <button
            onClick={() => {
              dispatch({ type: "reset" });
            }}
            className="btn px-2 py-1 text-white"
          >
            Reset
          </button>
        </div>
      </div>
      <RoomFrame />
      <div className="flex items-center justify-end text-sm relative">
        <button
          className="bg-slate-800 rounded-md px-2 py-1"
          onClick={() => {
            setShowMiniModal((o) => !o);
          }}
        >
          Minimap
        </button>
        {showMiniModal && (
          <div className="absolute z-50 bottom-12 right-0">
            <Miniminimap onClose={() => setShowMiniModal(false)} />
          </div>
        )}
      </div>
      <Inventory />

      {showModal && (
        <Modal onClose={() => handleShowModal(false)}>
          <Intro />
        </Modal>
      )}
    </div>
  );
}

export default Game;
