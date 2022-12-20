import React, { useMemo } from "react";
import { initialState } from "../data/setup";
import _ from "lodash";
import { gameReducer } from "./gameReducer";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../data/constants";

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
  const { monstersByRoomId, currentRoom, captivesByRoomId, learnedRecipeIds } =
    state;
  const [showModal, setShowModal] = React.useState(false);

  const handleShowModal = (show) => {
    setShowModal(show);
  };

  const freedCaptiveList = useMemo(() => {
    return _.values(captivesByRoomId).filter((c) => c.freed);
  }, [captivesByRoomId]);

  const currentRoomMonster = useMemo(() => {
    return monstersByRoomId[currentRoom.id] ?? null;
  }, [monstersByRoomId, currentRoom.id]);

  const learnedRecipeList = useMemo(() => {
    return learnedRecipeIds.map((id) => RECIPES_BY_ID[id]);
  }, [learnedRecipeIds]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        freedCaptiveList,
        currentRoomMonster,
        learnedRecipeList,
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
