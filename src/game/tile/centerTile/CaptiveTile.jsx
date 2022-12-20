import React from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Cage from "../../img/cage.svg";
import Key from "../../img/key.svg";
import { CaptiveImage } from "../../components/Captive";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";
import { Item } from "../../components/Item";
import { ITEMS_BY_ID } from "../../../data/constants";

export function CaptiveTile({ room }) {
  const { captivesByRoomId, haveKeysTo } = useGame();
  const dispatch = useGameDispatch();
  const captive = captivesByRoomId[room.id];
  const haveKey = haveKeysTo.includes(captive.id);
  const { colorClass } = captive;

  const { open, toggleOpen } = useOpen();

  const handleFreeCaptive = () => {
    dispatch({
      type: "freeCaptive",
      payload: { roomId: room.id },
    });
  };

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <div className="top-0 left-0 absolute w-full h-full flex items-center justify-center text-white z-40">
          <Svg source={Cage} width="100%" height="80%" />
        </div>
        {!captive.freed ? (
          <div
            className={`${captive.colorClass} top-0 left-0 absolute w-full h-full flex items-center justify-center text-white z-30`}
          >
            <CaptiveImage
              captive={captive}
              width="50%"
              height="30%"
              color="currentColor"
            />
          </div>
        ) : null}
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <div className="flex flex-col justify-center items-center align-center gap-2">
          {
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFreeCaptive();
                }}
                disabled={!haveKey || captive.freed}
                className="p-1 whitespace-pre w-min flex justify-center items-center gap-2 disabled:opacity-50 disabled:bg-transparent bg-slate-800 rounded-sm"
              >
                <div className="ml-2 flex items-center justify-center h-4 w-4 relative">
                  <div className={`relative h-full w-full ${colorClass}`}>
                    <Svg source={Key} height="80%" width="100%" />
                  </div>
                </div>
                <div className="table-row">
                  <div className="h-full table-cell align-middle">⟶</div>
                </div>

                <Item
                  item={ITEMS_BY_ID[captive.teaches.recipeId]}
                  // colorClass="text-slate-500"
                />
              </button>
            </>
          }
        </div>
      </DialogueBox>
    </>
  );
}
