import React from "react";
import { ModalContext, useGame, useGameDispatch } from "../state/GameContext";
import Modal from "./components/Modal";
import Inventory from "./Inventory";
import Minimap from "./Minimap";
import RoomFrame from "./Room";

function Game() {
  const { currentRoom } = useGame();
  const dispatch = useGameDispatch();
  const { showModal, handleShowModal } = React.useContext(ModalContext);
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

        <div className="flex gap-2 text-sm text-slate-400">
          <button
            onClick={() => {
              dispatch({ type: "reset" });
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              handleShowModal(true);
            }}
          >
            Minimap
          </button>
        </div>
      </div>
      <RoomFrame />
      <Inventory />
      {showModal && (
        <Modal onClose={() => handleShowModal(false)}>
          <Minimap />
        </Modal>
      )}
    </div>
  );
}

export default Game;
