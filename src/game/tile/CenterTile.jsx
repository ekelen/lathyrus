import React from "react";

import { ROOM_TYPES } from "../../data/constants";
import { CaptiveTile } from "./centerTiles/CaptiveTile";
import { ContainerTile } from "./centerTiles/ContainerTile";
import { LabTile } from "./centerTiles/LabTile";
import { LevelExitTile } from "./centerTiles/LevelExitTile";
import { MonsterTile } from "./centerTiles/MonsterTile";

export function CenterTile({ room }) {
  return (
    <div className="flex flex-col justify-center items-center relative h-full w-full">
      {(() => {
        switch (room.type) {
          case ROOM_TYPES.container:
            return <ContainerTile room={room} />;
          case ROOM_TYPES.monster:
            return <MonsterTile room={room} />;
          case ROOM_TYPES.captive:
            return <CaptiveTile room={room} />;
          case ROOM_TYPES.lab:
            return <LabTile room={room} />;
          case ROOM_TYPES.exit:
            return <LevelExitTile room={room} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
