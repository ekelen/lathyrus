import React from "react";
import DialogueBox from "../../components/DialogueBox";
import { CenterTileContentContainer } from "../CenterTileContentContainer";

import { useGame, useGameDispatch } from "../../../state/GameContext";
import Svg from "../../components/Svg";
import Gate from "../../img/gate.svg";

export function LevelExitTile({ room }) {
  const dispatch = useGameDispatch();

  const handleMoveLevels = () => {
    dispatch({ type: "moveLevels" });
  };

  return (
    <>
      <CenterTileContentContainer>
        <div onClick={handleMoveLevels}>
          <Svg source={Gate} height="70%" width="100%" />
        </div>
      </CenterTileContentContainer>
      <DialogueBox isOpen={true} roomId={room.id} style={{ zIndex: "100" }}>
        <div className="text-md">
          <div className="">An unwelcoming gate...</div>
        </div>
      </DialogueBox>
    </>
  );
}
