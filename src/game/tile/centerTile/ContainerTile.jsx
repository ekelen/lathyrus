import React from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Chest from "../../img/chest.svg";
import { Item } from "../../components/Item";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";

function ContainerModalContents({
  currentRoom,
  currentRoomItems,
  handleTakeItem,
}) {
  const itemList = currentRoomItems.filter((item) => item.quantity > 0);

  return itemList.length <= 0 ? (
    <div>{currentRoom.containerName} is empty!</div>
  ) : (
    <div className="flex flex-wrap items-center gap-1 content-start">
      {itemList.map((item) => {
        return (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              handleTakeItem(item);
            }}
            className={`flex items-center justify-start whitespace-pre disabled:opacity-50 border-solid border border-gray-700 rounded-md pr-1`}
          >
            <Item item={item} />
            <div className="text-xs">x {item.quantity}</div>
          </button>
        );
      })}
    </div>
  );
}

export function ContainerTile({ room }) {
  const { roomItems, previousRoom } = useGame();
  const dispatch = useGameDispatch();
  const currentRoomItems = roomItems[room.id].filter(
    (item) => item.quantity > 0
  );
  const { open, toggleOpen } = useOpen(
    currentRoomItems.length > 0 && room.id !== previousRoom?.id
  );

  const handleTakeItem = (item) => {
    dispatch({
      type: "addToInventoryFromRoom",
      payload: { itemId: item.itemId, quantity: 1 },
    });
  };

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <Svg source={Chest} width="100%" height="80%" />
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <ContainerModalContents
          {...{ currentRoom: room, currentRoomItems, handleTakeItem }}
        />
      </DialogueBox>
    </>
  );
}
