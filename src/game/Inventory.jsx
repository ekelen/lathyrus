import React from "react";

import { useGame, useGameDispatch } from "../state/GameContext";
import SVG from "react-inlinesvg";
import Rabbit from "./img/rabbit.svg";

function Inventory(props) {
  const { inventory, currentRoom, freedCaptives } = useGame();
  const { type } = currentRoom;
  const dispatch = useGameDispatch();

  return (
    <div style={{ height: "100px" }}>
      {inventory
        .filter((item) => item.quantity > 0)
        .map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => {
                dispatch(
                  type === "storage"
                    ? {
                        type: "addToStorageFromInventory",
                        payload: { itemId: item.itemId, quantity: 1 },
                      }
                    : type === "monster"
                    ? {
                        type: "feed",
                        payload: { itemId: item.itemId },
                      }
                    : {}
                );
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
              {captive.id === "rabbit" ? (
                <SVG
                  src={Rabbit}
                  width={"100%"}
                  height="auto"
                  title="React"
                  preProcessor={(code) =>
                    code.replace(/fill=".*?"/g, 'fill="currentColor"')
                  }
                />
              ) : (
                captive.name
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Inventory;
