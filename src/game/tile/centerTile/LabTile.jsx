import React, { useCallback } from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Flasks from "../../img/flasks.svg";
import { Item } from "../../components/Item";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";

export function LabTile({ room }) {
  const { learnedRecipeIds, learnedRecipes, inventory } = useGame();
  const dispatch = useGameDispatch();
  const { open, toggleOpen } = useOpen();

  const hasIngredients = useCallback(
    (recipe) => {
      return recipe.ingredients.every((i) => {
        return inventory[i.itemId].quantity >= i.quantity;
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
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <Svg source={Flasks} width={"100%"} height="80%" />
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
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
                      key={`${ingredient.id}-${i}`}
                    >
                      <div
                        className={`flex items-center justify-start whitespace-pre pr-1 mx-1`}
                        style={
                          hasIngredient(ingredient) ? {} : { opacity: 0.5 }
                        }
                      >
                        <Item item={inventory[ingredient.itemId]} />
                        <div className="text-xs">x {ingredient.quantity}</div>
                      </div>
                      {i < r.ingredients.length - 1 ? (
                        <div>+</div>
                      ) : (
                        <div>=</div>
                      )}
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
                    {inventory[r.id].symbol}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </DialogueBox>
    </>
  );
}
