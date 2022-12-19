import React from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Chest from "../../img/chest.svg";
import { Item } from "../../components/Item";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";
import _ from "lodash";

function ContainerModalContents({ currentRoomItems, handleTakeItem }) {
  return (
    <div className="flex flex-wrap items-center gap-1 content-start w-full">
      {currentRoomItems.map((item) => {
        return (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              handleTakeItem(item);
            }}
            className={`flex items-center justify-start whitespace-pre disabled:opacity-50 border-solid border border-gray-700 rounded-md pr-1 h-6`}
          >
            <Item item={item} />
            <div className="text-xs">x {item.quantity}</div>
          </button>
        );
      })}
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
        <ContainerModalContents {...{ currentRoomItems, handleTakeItem }} />
      </DialogueBox>
    </>
  );
}
