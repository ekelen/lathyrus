import React from "react";
import { ROOM_TYPES } from "../../data/constants";
import { useGame } from "../../state/GameContext";
import { CaptiveImage } from "../components/Captive";

export function Captives({
  freedCaptiveList,
  selectedCaptiveId,
  setSelectedCaptiveId,
  // currentRoom
}) {
  const { currentRoom, currentRoomMonster } = useGame();
  const disabled =
    currentRoom.type !== ROOM_TYPES.monster || currentRoomMonster?.sated;
  // const disabled = true;
  return (
    <>
      {freedCaptiveList.map((captive) => {
        const { colorClass, dead, id } = captive;
        const opacity = dead ? "opacity-50" : "";
        return (
          <button
            className={`btn ${colorClass} ${opacity} h-6 w-6 relative mx-1 mt-2 mb-0 p-0.5 disabled:bg-transparent`}
            key={id}
            disabled={disabled || dead}
            onClick={() => {
              setSelectedCaptiveId(
                captive.id === selectedCaptiveId ? null : captive.id
              );
            }}
          >
            <CaptiveImage captive={captive} color="currentColor" />
            {/* </div> */}
          </button>
        );
      })}
    </>
  );
}
