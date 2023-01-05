import React, { useCallback, useMemo } from "react";
import { ITEMS_BY_ID } from "../../data/data";
import { ItemWithQuantityButton } from "../components/Item";
import { ROOM_TYPES } from "../../data/constants";
import { pick, pickBy } from "../../util/util";

export function InventoryItems({
  inventoryById,
  type,
  currentRoomMonster,
  dispatch,
}) {
  const disabled =
    (type !== ROOM_TYPES.monster && type !== ROOM_TYPES.container) ||
    currentRoomMonster?.sated;

  const handleItemClick = useCallback(
    ({ itemId, quantity = 1 }) => {
      switch (type) {
        case ROOM_TYPES.monster:
          dispatch({
            type: "feed",
            payload: { itemId },
          });
          break;
        case ROOM_TYPES.container:
          dispatch({
            type: "addToRoomFromInventory",
            payload: { itemId, quantity },
          });
          break;
        default:
          break;
      }
    },
    [type, dispatch]
  );

  const inventoryKeys = useMemo(() => {
    return Object.keys(pickBy(inventoryById, (item) => item > 0));
  }, [inventoryById]);
  const itemValues = useMemo(() => {
    return pick(ITEMS_BY_ID, inventoryKeys);
  }, [inventoryKeys]);
  return (
    <>
      {inventoryKeys.map((itemId) => {
        return (
          <ItemWithQuantityButton
            key={itemId}
            quantity={inventoryById[itemId]}
            item={itemValues[itemId]}
            disabled={disabled}
            onClick={() => {
              handleItemClick({ itemId });
            }}
          />
        );
      })}
    </>
  );
}
