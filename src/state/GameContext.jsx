import React, { useMemo } from "react";
import { initialState } from "../data/setup";
import _ from "lodash";
import { gameReducer } from "./gameReducer";
import { ITEMS, RECIPES } from "../data/constants";

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
  const { roomMonsters, currentRoom, captives, learnedRecipeIds } = state;

  const freedCaptives = useMemo(() => {
    return _.values(captives).filter((c) => c.freed);
  }, [captives]);

  const currentRoomMonster = useMemo(() => {
    return roomMonsters[currentRoom.id] ?? null;
  }, [roomMonsters, currentRoom.id]);

  const learnedRecipes = useMemo(() => {
    return learnedRecipeIds.map((id) => RECIPES[id]);
  }, [learnedRecipeIds]);

  return (
    <GameContext.Provider
      value={{ ...state, freedCaptives, currentRoomMonster, learnedRecipes }}
    >
      <GameDispatchContext.Provider value={dispatch}>
        {/* <ModalContext.Provider value={{ showModal, handleShowModal }}> */}
        {props.children}
        {/* </ModalContext.Provider> */}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};

export default GameContextProvider;
