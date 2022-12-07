import React from "react";
import { gameReducer, initialState } from "./gameReducer";
import _ from "lodash";
import { ITEMS } from "../data/setup";

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
  const [showModal, setShowModal] = React.useState(false);

  const currentRoomItems = React.useMemo(() => {
    return _.map(state.roomItems[state.currentRoom.id], (item) => ({
      ...item,
      ...ITEMS.find((i) => i.id === item.itemId),
    }));
  }, [state.currentRoom, state.roomItems]);

  const inventoryItems = React.useMemo(() => {
    return _.map(state.inventory, (item) => ({
      ...item,
      ...ITEMS.find((i) => i.id === item.itemId),
    }));
  }, [state.inventory]);

  const currentRoomMonster = React.useMemo(() => {
    return state.roomMonsters[state.currentRoom.id];
  }, [state.currentRoom.id, state.roomMonsters]);

  const handleShowModal = React.useCallback((show) => {
    setShowModal(show);
  }, []);

  return (
    <GameContext.Provider
      value={{ ...state, currentRoomItems, inventoryItems, currentRoomMonster }}
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
