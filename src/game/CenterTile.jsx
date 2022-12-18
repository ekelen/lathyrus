import React from "react";

import SVG from "react-inlinesvg";
import { ROOM_TYPES } from "../data/constants";
import { CaptiveTile } from "./tile/centerTile/CaptiveTile";
import { ContainerTile } from "./tile/centerTile/ContainerTile";
import { LabTile } from "./tile/centerTile/LabTile";
import { LevelExitTile } from "./tile/centerTile/LevelExitTile";
import { MonsterTile } from "./tile/centerTile/MonsterTile";
import { StorageTile } from "./tile/centerTile/StorageTile";

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
          case ROOM_TYPES.storage:
            return <StorageTile room={room} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
