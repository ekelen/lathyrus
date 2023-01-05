import React from "react";
import { useGame } from "../../../state/GameContext";
import { CaptiveImage } from "../../components/Captive";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Cage from "../../img/cage.svg";
import { CenterTileContentContainer } from "../CenterTileContentContainer";

export function CaptiveTile({ room }) {
  const { captivesByRoomId, haveKeysTo } = useGame();

  const captive = captivesByRoomId[room.id];
  const haveKey = haveKeysTo.includes(captive.id);
  const opacityClass = captive.freed ? "opacity-50" : "opacity-100";

  return (
    <>
      <CenterTileContentContainer>
        <div
          className={`top-0 left-0 absolute w-full h-full flex items-center justify-center z-40 ${opacityClass}`}
        >
          <Svg source={Cage} width="100%" height="80%" />
        </div>
        {!captive.freed ? (
          <div
            className={`${captive.colorClass} top-0 left-0 absolute w-full h-full flex items-center justify-center z-30`}
          >
            <CaptiveImage captive={captive} width="50%" height="30%" />
          </div>
        ) : null}
      </CenterTileContentContainer>
      <DialogueBox isOpen={true} roomId={room.id}>
        {haveKey && !captive.freed ? (
          <>Please! Use the key!</>
        ) : !haveKey && !captive.freed ? (
          <>Please find the key to free me!</>
        ) : (
          <>An empty cage...</>
        )}
      </DialogueBox>
    </>
  );
}
