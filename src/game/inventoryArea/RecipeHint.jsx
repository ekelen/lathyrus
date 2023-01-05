import React, { useMemo } from "react";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../../data/data";
import DialogueBox from "../components/DialogueBox";
import { Item, ItemWithQuantity } from "../components/Item";

export function RecipeHint({ selectedRecipeId, setSelectedRecipeId }) {
  const selectedRecipe = useMemo(
    () => (selectedRecipeId ? RECIPES_BY_ID[selectedRecipeId] : null),
    [selectedRecipeId]
  );

  return (
    <DialogueBox
      onClick={() => setSelectedRecipeId(null)}
      isOpen={!!selectedRecipeId}
      style={{
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100%",
        minWidth: "100%",
      }}
    >
      {!selectedRecipe ? null : (
        <div className="flex items-center justify-center">
          {selectedRecipe.ingredients.map((ingredient, i) => (
            <div
              className="flex items-center justify-center whitespace-pre"
              key={`${ingredient.id}-${i}`}
            >
              <ItemWithQuantity
                item={ITEMS_BY_ID[ingredient.itemId]}
                quantity={ingredient.quantity}
              />
              <div>{i < selectedRecipe.ingredients.length - 1 ? "+" : "⟶"}</div>
            </div>
          ))}
          <div className="ml-1">
            <Item item={ITEMS_BY_ID[selectedRecipe.id]} />
          </div>
        </div>
      )}
    </DialogueBox>
  );
}
