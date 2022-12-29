import React from "react";
import DialogueBox from "../../components/DialogueBox";
import { CenterTileContentContainer } from "../CenterTileContentContainer";
import { useOpen } from "../../useOpen";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import Svg from "../../components/Svg";
import Gate from "../../img/gate.svg";

export function LevelExitTile({ room }) {
  const { open, toggleOpen } = useOpen();
  const dispatch = useGameDispatch();
  const { freedCaptiveList, levelId } = useGame();
  const deadCaptiveList = freedCaptiveList.filter((c) => c.dead);

  const handleMoveLevels = (e) => {
    dispatch({ type: "moveLevels" });
    e.stopPropagation();
  };

  return (
    <>
      <CenterTileContentContainer>
        <div onClick={handleMoveLevels}>
          <Svg source={Gate} height="70%" width="100%" />
        </div>
      </CenterTileContentContainer>
      <DialogueBox
        onClick={toggleOpen}
        isOpen={open}
        roomId={room.id}
        style={{ zIndex: "100" }}
      >
        <div className="text-md">
          <div className="mb-3">You have reached the exit to {levelId}!</div>

          {/* <ul className="flex flex-col gap-2">
            <li>
              {freedCaptiveList.length === 2 ? "☑" : "𐄂"} Freed all test
              subjects
            </li>
            <li>
              {deadCaptiveList.length === 0 ? "☑" : "𐄂"} Escaped without
              sacrificing any test subjects
            </li>
          </ul> */}
        </div>
      </DialogueBox>
    </>
  );
}
