import React from "react";
import { ROOM_TYPES } from "../data/constants";
import { ROOMS_BY_ID } from "../data/data";
import { levels } from "../data/levels";
import Cage2 from "../game/img/cage2.svg";
import Chest2 from "../game/img/chest2.svg";
import Gate from "../game/img/gate.svg";
import { useGame } from "../state/GameContext";
import Svg from "./components/Svg";

function MinimapRoomTile({ room, roomId }) {
  const { freedCaptiveList, itemsByRoomId, monstersByRoomId } = useGame();

  const monsterColorClass =
    room.type === ROOM_TYPES.monster && monstersByRoomId[roomId].sated
      ? "text-gray-500"
      : "text-orange-700";
  const containerColorClass =
    room.type === ROOM_TYPES.container &&
    Object.values(itemsByRoomId[roomId]).reduce((a, b) => a + b, 0) > 0
      ? "text-amber-500"
      : "text-gray-500";
  const captiveColorClass =
    room.type === ROOM_TYPES.captive &&
    freedCaptiveList.find((captive) => captive.id === roomId)
      ? "text-gray-500"
      : "text-amber-200";

  return (
    <>
      {room.type === ROOM_TYPES.container ? (
        <div
          className={`${containerColorClass} w-full h-full flex items-center justify-center`}
        >
          <Svg source={Chest2} width="70%" height="50%" />
        </div>
      ) : room.type === ROOM_TYPES.captive ? (
        <div
          className={`${captiveColorClass} w-full h-full flex items-center justify-center`}
        >
          <Svg source={Cage2} width="100%" height="80%" />
        </div>
      ) : room.type === ROOM_TYPES.exit ? (
        <div
          className={`text-black w-full h-full flex items-center justify-center`}
        >
          <Svg source={Gate} width="100%" height="80%" />
        </div>
      ) : room.type === ROOM_TYPES.monster ? (
        <div
          className={`${monsterColorClass} w-full h-full flex items-center justify-center`}
        >
          <div className="font-alchemy h-3">🜊</div>
        </div>
      ) : null}
    </>
  );
}

function MinimapTile({ roomId, currentRoomId }) {
  const room = roomId && ROOMS_BY_ID[roomId];
  const backgroundClass = roomId ? "bg-transparent" : "bg-black";
  const currentRoomClass =
    roomId && roomId === currentRoomId
      ? "border-2 border-amber-500"
      : "border border-black";
  return (
    <div
      className={`h-5 w-5 ${currentRoomClass} text-xs relative ${backgroundClass}`}
    >
      {room ? <MinimapRoomTile room={room} roomId={roomId} /> : null}
    </div>
  );
}

function Minimap({ onClose = () => {} }) {
  const { currentRoom, levelId } = useGame();
  const roomPositions = levels[levelId].LEVEL_ROOM_POSITIONS;
  const levelColor = levels[levelId].LEVEL_COLOR;

  return (
    <div
      className={`flex flex-col relative items-center justify-center border border-slate-600 p-1 rounded-sm bg-black`}
      onClick={onClose}
    >
      {roomPositions.map((row, y) => {
        return (
          <div
            key={y + "row"}
            className={`flex items-center justify-center ${levelColor}`}
          >
            {row.map((roomId, x) => {
              return (
                <MinimapTile
                  key={`roomId-${x}-${y}`}
                  roomId={roomId}
                  currentRoomId={currentRoom.id}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Minimap;
