import React from "react";
import { ITEMS_BY_ID } from "../../../data/data";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import { UsableButton } from "../../components/Button";
import DialogueBox from "../../components/DialogueBox";
import { ItemWithQuantityButton } from "../../components/Item";
import Svg from "../../components/Svg";
import Chest from "../../img/chest2.svg";
import { CenterTileContentContainer } from "../CenterTileContentContainer";

function ContainerModalContents({
  currentRoomItems,
  handleTakeItem,
  handleTakeAllItems,
  disableTakeAll,
  disableTakeAny,
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
            disabled={disableTakeAny}
            onClick={(e) => {
              e.stopPropagation();
              handleTakeItem(itemId);
            }}
            className="disabled:opacity-50"
          />
        );
      })}
      <UsableButton
        className="disabled:opacity-50 ml-auto h-7 mb-1 px-2 text-xs"
        disabled={currentRoomItems.length < 1 || disableTakeAll}
        onClick={(e) => {
          e.stopPropagation();
          handleTakeAllItems();
        }}
      >
        All
      </UsableButton>
      <div className="h-6 w-0" />
    </div>
  );
}

export function ContainerTile({ room }) {
  const { itemsByRoomId, maxInventory, totalInventoryQuantity } = useGame();
  const dispatch = useGameDispatch();
  const currentRoomItems = Object.entries(itemsByRoomId[room.id]).filter(
    ([_itemId, quantity]) => quantity > 0
  );
  const totalCurrentRoomQuantity = Object.values(itemsByRoomId[room.id]).reduce(
    (a, b) => a + b
  );

  const disableTakeAny = totalInventoryQuantity >= maxInventory;
  const disableTakeAll =
    disableTakeAny ||
    totalCurrentRoomQuantity + totalInventoryQuantity > maxInventory;

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
        <Svg source={Chest} width="70%" height="50%" />
      </CenterTileContentContainer>
      <DialogueBox
        isOpen={true}
        roomId={room.id}
        style={{ minWidth: "280%", width: "280%" }}
      >
        <ContainerModalContents
          {...{
            currentRoomItems,
            handleTakeItem,
            handleTakeAllItems,
            disableTakeAny,
            disableTakeAll,
          }}
        />
      </DialogueBox>
    </>
  );
}
