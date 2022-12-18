import React from "react";
import DialogueBox from "../../components/DialogueBox";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";

export function LevelExitTile({ room }) {
  const { open, toggleOpen } = useOpen();

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        Exit!
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <div>You have reached the exit!</div>
      </DialogueBox>
    </>
  );
}
