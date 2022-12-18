import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { useGame } from "../../../state/GameContext";
import DialogueBox from "../../components/DialogueBox";
import Svg from "../../components/Svg";
import { GET_MONSTER_IMAGE } from "../../img/Monster";
import { CenterTileContentContainer } from "../../CenterTileContentContainer";
import { useOpen } from "../../useOpen";

function MonsterTileContents({ monster, room }) {
  const hungerPct = _.ceil((monster.hunger / monster.maxHunger) * 100);
  const markerRef = useRef(null);
  const hungerRef = useRef(null);
  useEffect(() => {
    if (hungerRef.current && markerRef.current) {
      hungerRef.current.style.width = `${hungerPct}%`;
      markerRef.current.style.left = `${hungerPct}%`;
    }
  }, [hungerPct]);
  const opacityClass = monster.sated ? "opacity-50" : "opacity-100";

  return (
    <div className={`relative w-full ${opacityClass} py-3`}>
      {
        <div className="relative w-full h-2 flex items-center">
          <div className="absolute w-full h-2 bg-slate-900 rounded-md" />
          <div className="absolute h-2 bg-slate-700" ref={hungerRef} />
          <div
            className="alchemy absolute h-full -top-1/2 text-amber-800 text-xl"
            ref={markerRef}
          >
            <div className="leading-none -ml-2">🜊</div>
          </div>
        </div>
      }
    </div>
  );
}

export function MonsterTile({ room }) {
  const { roomMonsters, previousRoom } = useGame();
  const monster = roomMonsters[room.id];
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
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <MonsterTileContents {...{ monster, room }} />
      </DialogueBox>
    </>
  );
}
