import React, { useContext } from "react";
import { ModalContext, useGame } from "../../../state/GameContext";
import { Button } from "../../components/Button";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Wizard from "../../img/wizard.svg";
import { CenterTileContentContainer } from "../CenterTileContentContainer";

export function EndTile({ room }) {
  const { handleShowModal } = useContext(ModalContext);

  return (
    <>
      <CenterTileContentContainer>
        <div className={`p-1  text-orange-500`}>
          <Svg source={Wizard} width={"100%"} height="100%" />
        </div>
      </CenterTileContentContainer>
      <DialogueBox
        isOpen={true}
        roomId={room.id}
        className={"flex-col"}
        style={{
          minWidth: "280%",
          width: "280%",
        }}
      >
        <div>Challenge the Vivisector?</div>
        <div className="flex items-center justify-center gap-3">
          <Button className="px-2 py-1" onClick={() => handleShowModal(true)}>
            Yes
          </Button>
          <Button className="px-2 py-1">Not yet</Button>
        </div>
      </DialogueBox>
    </>
  );
}
