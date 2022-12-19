import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { useGame } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import Key from "../../img/key.svg";
import { GET_MONSTER_IMAGE } from "../../img/Monster";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";

function MonsterTileContents({ monster, room }) {
  const { sated, hunger, maxHunger, hasKeyTo } = monster;
  const { captivesByRoomId } = useGame();
  const hungerPct = _.ceil((hunger / maxHunger) * 100);
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
      <div className="relative h-2" style={{ width: widthPct }}>
        <div className="absolute w-full h-2 bg-slate-900 rounded-md" />
        <div className="absolute h-2 bg-slate-700" ref={hungerRef} />
        {!hasKeyTo ? null : (
          <div className={`absolute h-6 w-6 -left-2 -top-2 ${keyColorClass}`}>
            <Svg source={Key} />
          </div>
        )}
        <div
          className="alchemy absolute h-full -top-1/2 text-amber-800 text-xl"
          ref={markerRef}
        >
          <div className="leading-none -ml-2">🜊</div>
        </div>
      </div>
    </div>
  );
}

export function MonsterTile({ room }) {
  const { monstersByRoomId, previousRoom } = useGame();
  const monster = monstersByRoomId[room.id];
  const { open, toggleOpen } = useOpen(
    !monster.sated && previousRoom?.id !== room.id
  );
  const opacityClass = monster.sated ? "opacity-50" : "opacity-100";

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <div
          className={`${opacityClass} h-full w-full absolute p-3 transition-opacity duration-600`}
        >
          <Svg
            source={GET_MONSTER_IMAGE(monster.image)}
            width={"100%"}
            height="80%"
          />
        </div>
      </CenterTileContentContainer>
      <DialogueBox
        onClick={toggleOpen}
        isOpen={open}
        roomId={room.id}
        style={{ minWidth: "280%", width: "280%" }}
      >
        <MonsterTileContents {...{ monster, room }} />
      </DialogueBox>
    </>
  );
}
