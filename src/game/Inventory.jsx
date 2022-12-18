import _ from "lodash";
import React, { useCallback } from "react";

import { ROOM_TYPES } from "../data/constants";
import { sortByName } from "../data/util";
import { useGame, useGameDispatch } from "../state/GameContext";
import { CaptiveImage } from "./components/Captive";
import { Item } from "./components/Item";
import Key from "./img/key.svg";
import Svg from "./components/Svg";

function Inventory(props) {
  const {
    inventory,
    currentRoom,
    freedCaptives,
    currentRoomMonster,
    haveKeysTo,
    captives,
  } = useGame();
  const { type } = currentRoom;
  const dispatch = useGameDispatch();
  const getCaptiveById = useCallback(
    (id) => {
      return _.values(captives).find((c) => c.id === id);
    },
    [captives, haveKeysTo]
  );

  return (
    <div className="flex h-24 w-100 mt-2 gap-1">
      <div className="flex flex-col flex-wrap h-full p-2 grow border-2 border-white border-double rounded-md align-start content-start justify-start">
        {sortByName(_.values(inventory))
          .filter((item) => item.quantity > 0)
          .map((item) => {
            return (
              <button
                key={item.id}
                className={`flex items-center justify-start whitespace-pre disabled:opacity-50`}
                disabled={
                  (type !== ROOM_TYPES.monster &&
                    type !== ROOM_TYPES.storage) ||
                  currentRoomMonster?.sated
                }
                onClick={() => {
                  switch (type) {
                    case ROOM_TYPES.storage:
                      dispatch({
                        type: "addToStorageFromInventory",
                        payload: { itemId: item.itemId, quantity: 1 },
                      });
                      break;
                    case ROOM_TYPES.monster:
                      dispatch({
                        type: "feed",
                        payload: { itemId: item.itemId },
                      });
                      break;
                    default:
                      break;
                  }
                }}
              >
                <Item item={item} />
                <div className="text-xs">x {item.quantity}</div>
              </button>
            );
          })}
      </div>
      <div className="flex flex-col flex-wrap relative h-full w-10 border border-white border-double rounded-md">
        {haveKeysTo
          .filter(
            (captiveId) => !freedCaptives.map((c) => c.id).includes(captiveId)
          )
          .map((key, i) => {
            const captive = getCaptiveById(key);
            return (
              <div
                className="flex items-center justify-center h-6 w-6 mx-2 mt-2 mb-0 relative"
                key={`${i}-${key}`}
              >
                <div className="relative h-full w-full">
                  <Svg
                    source={Key}
                    height="80%"
                    width="100%"
                    color={captive?.color || "#333"}
                  />
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex flex-col flex-wrap relative h-full w-10 border border-white border-double rounded-md">
        {freedCaptives.map((captive) => {
          return (
            <div
              className="flex items-center justify-center h-6 w-6 relative mx-2 mt-2 mb-0"
              key={captive.id}
            >
              <div className="absolute h-full w-full">
                <CaptiveImage captive={captive} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;
