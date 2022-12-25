import React from "react";
import DialogueBox from "../../components/DialogueBox";
import { CenterTileContentContainer } from "../CenterTileContentContainer";
import { useOpen } from "../../useOpen";
import { useGame } from "../../../state/GameContext";

export function LevelExitTile({ room }) {
  const { open, toggleOpen } = useOpen();
  const { freedCaptiveList } = useGame();
  const deadCaptiveList = freedCaptiveList.filter((c) => c.dead);

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        Exit!
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <div className="text-md">
          <div className="mb-3">You have reached the exit!</div>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              {freedCaptiveList.length === 2 ? "☑" : "𐄂"} Freed all test
              subjects
            </li>
            <li>
              {deadCaptiveList.length === 0 ? "☑" : "𐄂"} Escaped without
              sacrificing any test subjects
            </li>
          </ul>
        </div>
      </DialogueBox>
    </>
  );
}
