import React from "react";
import { ModalContext, useGame, useGameDispatch } from "../state/GameContext";
import { Button } from "./components/Button";
import Modal from "./components/Modal";
import Intro from "./Intro";
import Inventory from "./Inventory";
import Minimap from "./Minimap";
import RoomFrame from "./Room";

function Game() {
  const dispatch = useGameDispatch();
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
              dispatch({ type: "reset" });
            }}
            className="px-2 py-1"
          >
            Reset
          </Button>
        </div>
      </div>
      <RoomFrame />
      <div className="flex items-end justify-end text-sm relative portrait:h-24 landscape:h-auto mt-2">
        <Button
          className="px-2 py-1"
          onClick={() => {
            setShowMiniModal((o) => !o);
          }}
        >
          Minimap
        </Button>
        {showMiniModal && (
          <div className="absolute z-50 bottom-12 right-0">
            <Minimap onClose={() => setShowMiniModal(false)} />
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
