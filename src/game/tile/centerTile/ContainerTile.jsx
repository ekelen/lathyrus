import React from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Chest from "../../img/chest.svg";
import {
  Item,
  ItemWithQuantity,
  ItemWithQuantityButton,
} from "../../components/Item";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";
import _ from "lodash";

function ContainerModalContents({
  currentRoomItems,
  handleTakeItem,
  handleTakeAllItems,
}) {
  return (
    <div className="flex flex-wrap items-center content-start w-full">
      {currentRoomItems.map((item) => {
        return (
          <ItemWithQuantityButton
            key={item.id}
            item={item}
            quantity={item.quantity}
            onClick={(e) => {
              e.stopPropagation();
              handleTakeItem(item);
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
  const { itemsByRoomId, previousRoom } = useGame();
  const dispatch = useGameDispatch();
  const currentRoomItems = _.values(itemsByRoomId[room.id]).filter(
    (i) => i.quantity > 0
  );

  const { open, toggleOpen } = useOpen(
    currentRoomItems.length > 0 && room.id !== previousRoom?.id
  );
  const openable = currentRoomItems.length > 0;
  const openableClass = openable ? "opacity-100" : "opacity-20";

  const handleTakeItem = (item) => {
    dispatch({
      type: "addToInventoryFromRoom",
      payload: { itemId: item.id, quantity: 1 },
    });
  };
  const handleTakeAllItems = () => {
    dispatch({
      type: "addAllToInventoryFromRoom",
    });
  };

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <div className={`${openableClass}`}>
          <Svg source={Chest} width="100%" height="80%" />
        </div>
      </CenterTileContentContainer>
      <DialogueBox
        onClick={() => {}}
        isOpen={openable}
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
