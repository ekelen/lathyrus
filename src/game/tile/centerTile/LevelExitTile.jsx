import React from "react";
import DialogueBox from "../../components/DialogueBox";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";

export function LevelExitTile({ room }) {
  const { open, toggleOpen } = useOpen();
  const { freedCaptiveList } = useGame();

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        Exit!
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <div>
          You have reached the exit! And that's the end of the game for now...{" "}
          {freedCaptiveList.length < 2
            ? "You might want to go free the other captive though."
            : ""}
        </div>
      </DialogueBox>
    </>
  );
}
