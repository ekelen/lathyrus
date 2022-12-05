import React from "react";
import { gameReducer, initialState } from "./gameReducer";
import _ from "lodash";
import { ITEMS } from "../data/setup";

export const GameContext = React.createContext();

const DispatchContext = React.createContext();

export function useGame() {
  return React.useContext(GameContext);
}

export function useGameDispatch() {
  return React.useContext(DispatchContext);
}

const GameContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(gameReducer, initialState);

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

  return (
    <GameContext.Provider
      value={{ ...state, currentRoomItems, inventoryItems, currentRoomMonster }}
    >
      <DispatchContext.Provider value={dispatch}>
        {props.children}
      </DispatchContext.Provider>
    </GameContext.Provider>
  );
};

export default GameContextProvider;
