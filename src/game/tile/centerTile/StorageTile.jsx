import React, { useCallback } from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Storage from "../../img/storage.svg";
import { Item } from "../../components/Item";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";
import _ from "lodash";

export function StorageTile({ room }) {
  const { inventory, storageItems } = useGame();
  const dispatch = useGameDispatch();
  const { open, toggleOpen } = useOpen();

  const storageItemList = _.values(storageItems).filter(
    (item) => item.quantity > 0
  );

  const handleAddToInventoryFromStorage = ({ itemId, quantity }) => {
    dispatch({
      type: "addToInventoryFromStorage",
      payload: { itemId, quantity },
    });
  };

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <Svg source={Storage} width={"100%"} height="80%" />
      </CenterTileContentContainer>
      <DialogueBox
        onClick={() => {}}
        isOpen={true}
        roomId={room.id}
        style={{ minWidth: "280%", width: "280%" }}
      >
        <div className="flex flex-wrap items-center gap-1 content-start">
          {storageItemList.map((item) => {
            return (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToInventoryFromStorage({
                    itemId: item.itemId,
                    quantity: 1,
                  });
                }}
                className={`flex items-center justify-start whitespace-pre disabled:opacity-50 border-solid border border-gray-700 rounded-md pr-1`}
              >
                <Item item={item} />
                <div className="text-xs">x {item.quantity}</div>
              </button>
            );
          })}
        </div>
      </DialogueBox>
    </>
  );
}
