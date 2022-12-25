import React, { useMemo } from "react";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../../data/data";
import { CaptiveImage } from "../components/Captive";
import DialogueBox from "../components/DialogueBox";
import { Item, ItemWithQuantity } from "../components/Item";

export function CaptiveRecipeHint({
  setSelectedCaptiveId,
  selectedCaptiveId,
  captivesByRoomId,
}) {
  const selectedCaptive = useMemo(
    () => (selectedCaptiveId ? captivesByRoomId[selectedCaptiveId] : null),
    [selectedCaptiveId, captivesByRoomId]
  );
  const selectedCaptiveRecipe = useMemo(
    () =>
      !selectedCaptive ? null : RECIPES_BY_ID[selectedCaptive.teaches.recipeId],
    [selectedCaptive]
  );

  return (
    <DialogueBox
      onClick={() => setSelectedCaptiveId(null)}
      isOpen={!!selectedCaptiveRecipe}
      style={{
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100%",
        minWidth: "100%",
      }}
    >
      {!selectedCaptiveRecipe ? null : (
        <div className="flex items-center justify-center">
          <div className={`${selectedCaptive.colorClass} h-6 w-6 relative`}>
            <CaptiveImage
              height="80%"
              width="100%"
              captive={selectedCaptive}
              color="currentColor"
            />
          </div>
          <div>: In a lab, </div>
          {selectedCaptiveRecipe.ingredients.map((ingredient, i) => (
            <div
              className="flex items-center justify-center whitespace-pre"
              key={`${ingredient.id}-${i}`}
            >
              <ItemWithQuantity
                item={ITEMS_BY_ID[ingredient.itemId]}
                quantity={ingredient.quantity}
              />
              <div>
                {i < selectedCaptiveRecipe.ingredients.length - 1 ? "+" : "⟶"}
              </div>
            </div>
          ))}
          <div className="ml-1">
            <Item item={ITEMS_BY_ID[selectedCaptiveRecipe.id]} />
          </div>
        </div>
      )}
    </DialogueBox>
  );
}
