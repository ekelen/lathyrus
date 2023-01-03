import React, { useMemo } from "react";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../../data/data";

import { Item } from "../components/Item";

export function Recipes({
  freedCaptiveList = [],
  selectedCaptiveId = null,
  setSelectedCaptiveId = () => {},
  learnedRecipeIds = [],
  setSelectedRecipeId,
  selectedRecipeId,
}) {
  const learnedRecipeItems = useMemo(() => {
    return learnedRecipeIds.map((id) => ITEMS_BY_ID[id]);
  }, [learnedRecipeIds]);
  return (
    <>
      {learnedRecipeItems.map((item) => {
        // const { colorClass } = captive;
        return (
          <button
            className="flex items-center justify-center h-6 w-6 relative mx-1 mt-2 mb-0 rounded-md bg-slate-800 p-1"
            key={item.id}
            onClick={
              () => {
                setSelectedRecipeId(
                  selectedRecipeId === item.id ? null : item.id
                );
              }
              // setSelectedCaptiveId(
              //   captive.id === selectedCaptiveId ? null : captive.id
              // )
            }
          >
            <div className={`${item.colorClass}`}>
              <Item item={item} />
            </div>
          </button>
        );
      })}
    </>
  );
}
