import React, { useEffect, useRef } from "react";
import { useGame, useGameDispatch } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Key from "../../img/key.svg";
import { GET_MONSTER_IMAGE } from "../../img/Monster";
import { CenterTileContentContainer } from "../CenterTileContentContainer";

function MonsterTileDialogueContents({ monster, errorMessage }) {
  const { sated, hunger, maxHunger, hasKeyTo } = monster;
  const { captivesByRoomId } = useGame();

  const hungerPct = Math.ceil((hunger / maxHunger) * 100);
  const markerRef = useRef(null);
  const hungerRef = useRef(null);
  useEffect(() => {
    if (hungerRef.current && markerRef.current) {
      hungerRef.current.style.width = `${hungerPct}%`;
      markerRef.current.style.left = `${hungerPct}%`;
    }
  }, [hungerPct]);
  const opacityClass = sated ? "opacity-50" : "opacity-100";
  const monsterDifficulty = Math.log2(maxHunger);
  const widthPct = `${monsterDifficulty * 10}%`;
  const keyColorClass = !hasKeyTo ? "" : captivesByRoomId[hasKeyTo].colorClass;

  return (
    <div
      className={`relative w-full ${opacityClass} py-3 flex items-center justify-center`}
    >
      {errorMessage ? (
        <div className="absolute w-full h-full bg-black rounded-md flex items-center justify-center z-10">
          <div className="text-orange-900 text-sm">{errorMessage}</div>
        </div>
      ) : null}
      <div className="relative h-2" style={{ width: widthPct }}>
        <div className="absolute w-full h-2 bg-slate-900 rounded-md" />
        <div className="absolute h-2 bg-slate-800 rounded-md" ref={hungerRef} />
        {!hasKeyTo ? null : (
          <div className={`absolute h-6 w-6 -left-2 -top-2 ${keyColorClass}`}>
            <Svg source={Key} />
          </div>
        )}
        <div
          className={`font-alchemy absolute h-full -top-1/2 text-orange-700 text-xl`}
          ref={markerRef}
        >
          <div className="leading-none -ml-2 font-alchemy">🜊</div>
        </div>
      </div>
    </div>
  );
}

export function MonsterTile({ room }) {
  const { monstersByRoomId, errorMessage } = useGame();

  const monster = monstersByRoomId[room.id];
  const opacityClass = monster.sated ? "opacity-50" : "";

  return (
    <>
      <CenterTileContentContainer>
        <div className={`${opacityClass} p-1 transition-opacity duration-600`}>
          <Svg
            source={GET_MONSTER_IMAGE(monster.image)}
            width={"100%"}
            height="70%"
          />
        </div>
      </CenterTileContentContainer>
      <DialogueBox
        isOpen={true}
        roomId={room.id}
        className={errorMessage ? "border-orange-900" : ""}
        style={{
          minWidth: "280%",
          width: "280%",
          // ...(!!errorMessage && { borderColor: "red" }),
        }}
      >
        <MonsterTileDialogueContents {...{ monster, errorMessage }} />
      </DialogueBox>
    </>
  );
}
