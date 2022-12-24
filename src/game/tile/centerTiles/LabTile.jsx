import React, { useCallback, useMemo } from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Flasks from "../../img/flasks.svg";
import { Item, ItemWithQuantity } from "../../components/Item";
import { CenterTileContentContainer } from "../CenterTileContentContainer";
import { useOpen } from "../../useOpen";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../../../data/data";

function LabTileDialogueContent({
  room,
  inventoryById,
  learnedRecipeIds,
  dispatch,
}) {
  const learnedRecipeList = useMemo(() => {
    return learnedRecipeIds.map((id) => RECIPES_BY_ID[id]);
  }, [learnedRecipeIds]);
  const hasIngredients = useCallback(
    (recipe) => {
      return recipe.ingredients.every((ingredient) => {
        return inventoryById[ingredient.itemId] >= ingredient.quantity;
      });
    },
    [inventoryById]
  );
  const hasIngredient = useCallback(
    (ingredient) => {
      return inventoryById[ingredient.itemId] >= ingredient.quantity;
    },
    [inventoryById]
  );
  const handleCombineItems = (recipeId) => {
    dispatch({
      type: "combineItems",
      payload: { recipeId },
    });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {!learnedRecipeIds.length ? (
          <span>You haven't learned any recipes yet...</span>
        ) : (
          learnedRecipeList.map((r) => {
            return (
              <div
                className="flex items-center justify-center  mb-1"
                key={r.id}
              >
                {r.ingredients.map((ingredient, i) => {
                  const itemWrapperClass = hasIngredient(ingredient)
                    ? ""
                    : "opacity-50";
                  return (
                    <div
                      className="flex items-center justify-center whitespace-pre"
                      key={`${ingredient.itemId}-${i}`}
                    >
                      <ItemWithQuantity
                        item={ITEMS_BY_ID[ingredient.itemId]}
                        quantity={ingredient.quantity}
                        wrapperClass={itemWrapperClass}
                      />
                      <div>{i < r.ingredients.length - 1 ? "+" : "⟶"}</div>
                    </div>
                  );
                })}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCombineItems(r.id);
                  }}
                  disabled={!hasIngredients(r)}
                  className="rounded-sm bg-slate-800 whitespace-pre ml-2 disabled:opacity-50 active:border-amber-300 border border-slate-800 "
                >
                  <Item item={ITEMS_BY_ID[r.id]} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export function LabTile({ room }) {
  const { learnedRecipeIds, inventoryById } = useGame();
  const { open, toggleOpen } = useOpen();
  const dispatch = useGameDispatch();
  const disabled = learnedRecipeIds.length < 1;
  const centerContentClass = disabled ? "opacity-20" : "opacity-100";

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <div className={`w-full h-full ${centerContentClass}`}>
          <Svg source={Flasks} width={"100%"} height="80%" />
        </div>
      </CenterTileContentContainer>
      <DialogueBox
        onClick={() => {}}
        isOpen={learnedRecipeIds.length > 0}
        roomId={room.id}
      >
        <LabTileDialogueContent
          room={room}
          inventoryById={inventoryById}
          learnedRecipeIds={learnedRecipeIds}
          dispatch={dispatch}
        />
      </DialogueBox>
    </>
  );
}
