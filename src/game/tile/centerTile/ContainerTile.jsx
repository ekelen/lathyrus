import _ from "lodash";
import React from "react";
import { ITEMS_BY_ID } from "../../../data/gameData";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import DialogueBox from "../../components/DialogueBox";
import { ItemWithQuantityButton } from "../../components/Item";
import Svg from "../../components/Svg";
import Chest from "../../img/chest.svg";
import { useOpen } from "../../useOpen";

function ContainerModalContents({
  currentRoomItems,
  handleTakeItem,
  handleTakeAllItems,
}) {
  return (
    <div className="flex flex-wrap items-center content-start w-full">
      {currentRoomItems.map(([itemId, quantity]) => {
        const item = ITEMS_BY_ID[itemId];
        return (
          <ItemWithQuantityButton
            key={itemId}
            item={item}
            quantity={quantity}
            onClick={(e) => {
              e.stopPropagation();
              handleTakeItem(itemId);
            }}
            wrapperClass="disabled:opacity-50"
          />
        );
      })}
      <button
        className="rounded-sm bg-slate-800 whitespace-pre disabled:opacity-50 ml-auto h-6 mb-1 px-2 text-xs"
        disabled={currentRoomItems.length < 1}
        onClick={(e) => {
          e.stopPropagation();
          handleTakeAllItems();
        }}
      >
        All
      </button>
      <div className="h-6 w-0" />
    </div>
  );
}

export function ContainerTile({ room }) {
  const { itemsByRoomId } = useGame();
  const dispatch = useGameDispatch();
  const currentRoomItems = _.entries(itemsByRoomId[room.id]).filter(
    ([_itemId, quantity]) => quantity > 0
  );

  const open = currentRoomItems.length > 0;
  const openableClass = open ? "opacity-100" : "opacity-20";

  const handleTakeItem = (itemId) => {
    dispatch({
      type: "addToInventoryFromRoom",
      payload: { itemId, quantity: 1 },
    });
  };
  const handleTakeAllItems = () => {
    dispatch({
      type: "addAllToInventoryFromRoom",
    });
  };

  return (
    <>
      <CenterTileContentContainer>
        <div className={`${openableClass}`}>
          <Svg source={Chest} width="100%" height="80%" />
        </div>
      </CenterTileContentContainer>
      <DialogueBox
        isOpen={open}
        roomId={room.id}
        style={{ minWidth: "280%", width: "280%" }}
      >
        <ContainerModalContents
          {...{ currentRoomItems, handleTakeItem, handleTakeAllItems }}
        />
      </DialogueBox>
    </>
  );
}
