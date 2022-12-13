import React, { useMemo } from "react";
import { initialState } from "../data/setup";
import _ from "lodash";
import { gameReducer } from "./gameReducer";

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
  // const [showModal, setShowModal] = React.useState(false);

  // const handleShowModal = React.useCallback((show) => {
  //   setShowModal(show);
  // }, []);
  const freedCaptives = useMemo(() => {
    return _.values(state.captives).filter((c) => c.freed);
  }, [state.captives]);

  return (
    <GameContext.Provider value={{ ...state, freedCaptives }}>
      <GameDispatchContext.Provider value={dispatch}>
        {/* <ModalContext.Provider value={{ showModal, handleShowModal }}> */}
        {props.children}
        {/* </ModalContext.Provider> */}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};

export default GameContextProvider;
