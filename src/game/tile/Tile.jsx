import React from "react";
import { getPositionFromCoordinates, CENTER_POSITION } from "../../util/util";
import { CenterTile } from "./CenterTile";
import pine00 from "../img/trees/pine00.png";
import pine01 from "../img/trees/pine01.png";
import pine02 from "../img/trees/pine02.png";
import pine04 from "../img/trees/pine04.png";
import { levels } from "../../data/levels";

const TREE_IMG = [pine00, pine01, pine02, pine04];

function RoomDeadspaceTile({ room, tilePosition }) {
  return (
    <div
      className="bg-black h-full w-full bg-contain bg-no-repeat"
      style={{
        backgroundImage: `url('${
          TREE_IMG[
            (tilePosition + room.coordinates.x + room.coordinates.y) %
              TREE_IMG.length
          ]
        }')`,
      }}
    ></div>
  );
}

function RoomTile({ row, col, room }) {
  const tilePosition = getPositionFromCoordinates(col, row);
  const isCenter = tilePosition === CENTER_POSITION;
  const { levelId } = room;
  const isExitTile = room.exitTilePositions.includes(tilePosition);
  const backgroundClass =
    isCenter || isExitTile ? levels[levelId].LEVEL_COLOR : "bg-black";
  return (
    <div
      key={col}
      className={`flex items-center justify-center relative h-100 ${backgroundClass} w-1/3`}
    >
      {isCenter ? (
        <CenterTile type={room.type} room={room} />
      ) : isExitTile ? null : (
        <RoomDeadspaceTile {...{ room, tilePosition }} />
      )}
    </div>
  );
}

export default RoomTile;
