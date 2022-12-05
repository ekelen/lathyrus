import React from "react";

import { useGame, useGameDispatch } from "../state/GameContext";

function Inventory(props) {
  const { inventoryItems, currentRoomItems, currentRoom } = useGame();
  const { type } = currentRoom;
  const dispatch = useGameDispatch();
  return (
    <div style={{ height: "100px" }}>
      {inventoryItems
        .filter((item) => item.quantity > 0)
        .map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => {
                dispatch(
                  type === "container"
                    ? {
                        type: "addToRoomFromInventory",
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
              {item.name}x{item.quantity}
            </button>
          );
        })}
    </div>
  );
}

export default Inventory;
