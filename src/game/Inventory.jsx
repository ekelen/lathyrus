import React from "react";
import _ from "lodash";

import { useGame, useGameDispatch } from "../state/GameContext";
import SVG from "react-inlinesvg";
import { GET_CAPTIVE_IMAGE } from "./img/Captive";
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
      {freedCaptives.map((captive) => {
        return (
          <div style={{ height: "20px", width: "20px", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
              }}
            >
              {/* {captive.image === "rabbit" ? ( */}
              <CaptiveImage captive={captive} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CaptiveImage({ captive }) {
  const source = GET_CAPTIVE_IMAGE(captive.image);

  return (
    <SVG
      src={source}
      width={"100%"}
      height="auto"
      title="React"
      preProcessor={(code) =>
        code.replace(/fill=".*?"/g, 'fill="currentColor"')
      }
    />
  );
}

export default Inventory;
