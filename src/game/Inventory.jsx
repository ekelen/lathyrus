import React from "react";
import _ from "lodash";

import { useGame, useGameDispatch } from "../state/GameContext";
import SVG from "react-inlinesvg";
import { CaptiveImage, GET_CAPTIVE_IMAGE } from "./img/Captive";
import { sortByName } from "../data/util";
import { ROOM_TYPES } from "../data/constants";

function Inventory(props) {
  const { inventory, currentRoom, freedCaptives } = useGame();
  const { type } = currentRoom;
  const dispatch = useGameDispatch();

  return (
    <div style={{ height: "100px" }}>
      {sortByName(_.values(inventory))
        .filter((item) => item.quantity > 0)
        .map((item) => {
          return (
            <button
              key={item.id}
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
              {item.name} x {item.quantity}
            </button>
          );
        })}
      <div style={{ display: "flex" }}>
        {freedCaptives.map((captive) => {
          return (
            <div
              style={{ height: "25px", width: "25px", position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                }}
              >
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
