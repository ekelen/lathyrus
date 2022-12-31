import React, { useCallback, useMemo } from "react";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../../../data/data";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import { UsableButton } from "../../components/Button";
import DialogueBox from "../../components/DialogueBox";
import { Item, ItemWithQuantity } from "../../components/Item";
import Svg from "../../components/Svg";
import Flasks from "../../img/flasks.svg";
import { CenterTileContentContainer } from "../CenterTileContentContainer";

function Recipe({ recipe, inventoryById, handleCombineItems }) {
  const hasIngredients = recipe.ingredients.every((ingredient) => {
    return inventoryById[ingredient.itemId] >= ingredient.quantity;
  });

  const hasIngredient = useCallback(
    (ingredient) => {
      return inventoryById[ingredient.itemId] >= ingredient.quantity;
    },
    [inventoryById]
  );

  return (
    <div className="flex items-center justify-center mb-1">
      {recipe.ingredients.map((ingredient, i) => {
        const itemWrapperClass = hasIngredient(ingredient) ? "" : "opacity-50";
        return (
          <div
            className="flex items-center justify-center whitespace-pre"
            key={`${ingredient.itemId}-${i}`}
          >
            <ItemWithQuantity
              item={ITEMS_BY_ID[ingredient.itemId]}
              quantity={ingredient.quantity}
              className={itemWrapperClass}
            />
            <div>{i < recipe.ingredients.length - 1 ? "+" : "⟶"}</div>
          </div>
        );
      })}
      <UsableButton
        onClick={(e) => {
          e.stopPropagation();
          handleCombineItems(recipe.id);
        }}
        disabled={!hasIngredients}
        className="ml-2 disabled:opacity-50 disabled:animate-none animate-pulse"
      >
        <Item item={ITEMS_BY_ID[recipe.id]} />
      </UsableButton>
    </div>
  );
}

function LabTileDialogueContent({
  room,
  inventoryById,
  learnedRecipeIds,
  dispatch,
}) {
  const learnedRecipeList = useMemo(() => {
    return learnedRecipeIds.map((id) => RECIPES_BY_ID[id]);
  }, [learnedRecipeIds]);

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
              <Recipe
                key={r.id}
                recipe={r}
                inventoryById={inventoryById}
                handleCombineItems={handleCombineItems}
              />
            );
          })
        )}
      </div>
    </>
  );
}

export function LabTile({ room }) {
  const { learnedRecipeIds, inventoryById } = useGame();
  const dispatch = useGameDispatch();

  return (
    <>
      <CenterTileContentContainer>
        <Svg source={Flasks} width={"100%"} height="80%" />
      </CenterTileContentContainer>
      <DialogueBox isOpen={true} roomId={room.id}>
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
