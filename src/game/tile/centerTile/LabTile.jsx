import React, { useCallback } from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Flasks from "../../img/flasks.svg";
import { Item } from "../../components/Item";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";

function LabTileDialogueContent({
  room,
  learnedRecipes,
  inventory,
  learnedRecipeIds,
  dispatch,
}) {
  const hasIngredients = useCallback(
    (recipe) => {
      return recipe.ingredients.every((ingredient) => {
        return inventory[ingredient.itemId].quantity >= ingredient.quantity;
      });
    },
    [inventory]
  );

  const hasIngredient = useCallback(
    (ingredient) => {
      return inventory[ingredient.itemId].quantity >= ingredient.quantity;
    },
    [inventory]
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
          learnedRecipes.map((r) => {
            return (
              <div
                className="flex items-center justify-center  mb-1"
                key={r.id}
              >
                {r.ingredients.map((ingredient, i) => (
                  <div
                    className="flex items-center justify-center whitespace-pre"
                    key={`${ingredient.itemId}-${i}`}
                  >
                    <div
                      className={`flex items-center justify-start whitespace-pre pr-1 mx-1`}
                      style={hasIngredient(ingredient) ? {} : { opacity: 0.5 }}
                    >
                      <Item item={inventory[ingredient.itemId]} />
                      <div className="text-xs">x {ingredient.quantity}</div>
                    </div>
                    {i < r.ingredients.length - 1 ? <div>+</div> : <div>=</div>}
                  </div>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCombineItems(r.id);
                  }}
                  disabled={!hasIngredients(r)}
                  className="border border-white rounded-md border-solid whitespace-pre p-1 ml-2 disabled:opacity-50"
                >
                  <Item item={inventory[r.id]} />
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
  const { learnedRecipeIds, learnedRecipes, inventory } = useGame();
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
          learnedRecipes={learnedRecipes}
          inventory={inventory}
          learnedRecipeIds={learnedRecipeIds}
          dispatch={dispatch}
        />
      </DialogueBox>
    </>
  );
}
