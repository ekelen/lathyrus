import React, { useMemo } from "react";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../../data/data";
import { useGameDispatch } from "../../state/GameContext";
import { CaptiveImage } from "../components/Captive";
import DialogueBox from "../components/DialogueBox";
import { Item, ItemWithQuantity } from "../components/Item";

export function FeedCaptiveConfirm({
  setSelectedCaptiveId,
  selectedCaptiveId,
  captivesByRoomId,
}) {
  const dispatch = useGameDispatch();
  const selectedCaptive = useMemo(
    () => (selectedCaptiveId ? captivesByRoomId[selectedCaptiveId] : null),
    [selectedCaptiveId, captivesByRoomId]
  );
  //   const selectedCaptiveRecipe = useMemo(
  //     () =>
  //       !selectedCaptive ? null : RECIPES_BY_ID[selectedCaptive.teaches.recipeId],
  //     [selectedCaptive]
  //   );

  return (
    <DialogueBox
      onClick={() => setSelectedCaptiveId(null)}
      isOpen={!!selectedCaptive}
      style={{
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100%",
        minWidth: "100%",
      }}
    >
      {!selectedCaptive ? null : (
        <div className="flex items-center justify-center gap-2 text-xs">
          <div
            className={`${selectedCaptive.colorClass} h-6 w-6 relative grow`}
          >
            <CaptiveImage
              height="80%"
              width="100%"
              captive={selectedCaptive}
              color="currentColor"
            />
          </div>
          <div>Feed me to the monster?</div>
          <div className="flex flex-col items-center gap-2 justify-center">
            <button
              className="btn px-2"
              onClick={() =>
                dispatch({
                  type: "feedCaptive",
                  payload: { captiveId: selectedCaptive.id },
                })
              }
            >
              Yes.
            </button>
            <button
              className="btn px-2"
              onClick={() => setSelectedCaptiveId(null)}
            >
              Nope, you're staying with me.
            </button>
          </div>
        </div>
      )}
    </DialogueBox>
  );
}
