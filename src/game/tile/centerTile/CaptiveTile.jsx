import React from "react";
import { ITEMS_BY_ID } from "../../../data/gameData";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { CaptiveImage } from "../../components/Captive";
import DialogueBox from "../../components/DialogueBox";
import { Item } from "../../components/Item";
import Svg from "../../components/Svg";
import Cage from "../../img/cage.svg";
import Key from "../../img/key.svg";

export function CaptiveTile({ room }) {
  const { captivesByRoomId, haveKeysTo } = useGame();
  const dispatch = useGameDispatch();
  const captive = captivesByRoomId[room.id];
  const haveKey = haveKeysTo.includes(captive.id);
  const { colorClass } = captive;
  const opacityClass = captive.freed ? "opacity-50" : "opacity-100";

  const handleFreeCaptive = () => {
    dispatch({
      type: "freeCaptive",
      payload: { roomId: room.id },
    });
  };

  return (
    <>
      <CenterTileContentContainer>
        <div
          className={`top-0 left-0 absolute w-full h-full flex items-center justify-center text-white z-40 ${opacityClass}`}
        >
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
      <DialogueBox isOpen={!captive.freed} roomId={room.id}>
        <div className="flex flex-col justify-center items-center align-center gap-2">
          {
            <>
              <button
                onClick={(e) => {
                  handleFreeCaptive();
                }}
                disabled={!haveKey || captive.freed}
                className="p-1 whitespace-pre w-min flex justify-center items-center gap-2 disabled:opacity-50 disabled:bg-transparent bg-slate-800 rounded-sm"
              >
                <div
                  className={`ml-2 flex items-center justify-center h-4 w-4 relative ${colorClass}`}
                >
                  <Svg source={Key} height="80%" width="100%" />
                </div>
                :
                {/* <div className="ml-1 flex items-center justify-center h-5 w-5 relative">
                  <Svg source={Compass} height="100%" width="100%" />
                </div>
                <div className="h-10 w-12 relative">
                  <Svg source={Flasks} height="100%" width="100%" />
                </div> */}
                <Item symbol="?" colorClass={"text-slate-300"} />
                <div>+</div>
                <Item symbol="?" colorClass={"text-slate-300"} />
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
