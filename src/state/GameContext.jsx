import React, { useEffect, useMemo } from "react";
import { gameReducer } from "./gameReducer";
import { initialState } from "./setup";

export const GameContext = React.createContext();
const GameDispatchContext = React.createContext();

export const ModalContext = React.createContext();

export function useGame() {
  return React.useContext(GameContext);
}

export function useGameDispatch() {
  return React.useContext(GameDispatchContext);
}

const GameContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(gameReducer, initialState);
  const { monstersByRoomId, currentRoom, captivesByRoomId, errorMessage } =
    state;
  const [showModal, setShowModal] = React.useState(true);

  const handleShowModal = (show) => {
    setShowModal(show);
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        dispatch({ type: "clearErrorMessage" });
      }, 1000);
    }
  }, [errorMessage]);

  const freedCaptiveList = useMemo(() => {
    return Object.values(captivesByRoomId).filter((c) => c.freed);
  }, [captivesByRoomId]);

  const currentRoomMonster = useMemo(() => {
    return monstersByRoomId[currentRoom.id] ?? null;
  }, [monstersByRoomId, currentRoom.id]);

  const totalInventoryQuantity = useMemo(() => {
    return Object.values(state.inventoryById).reduce((acc, val) => {
      return acc + val;
    });
  }, [state.inventoryById]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        freedCaptiveList,
        currentRoomMonster,
        totalInventoryQuantity,
      }}
    >
      <GameDispatchContext.Provider value={dispatch}>
        <ModalContext.Provider value={{ showModal, handleShowModal }}>
          {props.children}
        </ModalContext.Provider>
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};

export default GameContextProvider;
