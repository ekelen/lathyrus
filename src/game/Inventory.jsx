import React from "react";

import { useGame, useGameDispatch } from "../state/GameContext";
import { CaptiveRecipeHint } from "./inventoryArea/CaptiveRecipeHint";
import { InventoryItems } from "./inventoryArea/InventoryItems";
import { Keys } from "./inventoryArea/Keys";
import { Captives } from "./inventoryArea/Captives";

function Inventory() {
  const {
    inventoryById,
    currentRoom,
    freedCaptiveList,
    currentRoomMonster,
    haveKeysTo,
    captivesByRoomId,
  } = useGame();
  const { type } = currentRoom;
  const dispatch = useGameDispatch();
  const [selectedCaptiveId, setSelectedCaptiveId] = React.useState(null);

  return (
    <div className="flex h-28 w-100 mt-2 gap-1 relative">
      <div className="flex flex-col flex-wrap h-full p-2 grow border-2 border-slate-700 border-double rounded-md align-start content-start justify-start">
        <InventoryItems
          inventoryById={inventoryById}
          type={type}
          currentRoomMonster={currentRoomMonster}
          dispatch={dispatch}
        />
      </div>
      <div className="flex flex-col items-center relative h-full w-10 border-2 border-slate-700 border-double rounded-md">
        <Keys
          captivesByRoomId={captivesByRoomId}
          haveKeysTo={haveKeysTo}
          currentRoomId={currentRoom.id}
          dispatch={dispatch}
        />
      </div>
      <div className="flex flex-col flex-wrap relative h-full w-10 border-2 border-slate-700 border-double rounded-md items-center">
        <Captives
          freedCaptiveList={freedCaptiveList}
          selectedCaptiveId={selectedCaptiveId}
          setSelectedCaptiveId={setSelectedCaptiveId}
        />
      </div>
      <CaptiveRecipeHint
        selectedCaptiveId={selectedCaptiveId}
        captivesByRoomId={captivesByRoomId}
        setSelectedCaptiveId={setSelectedCaptiveId}
      />
    </div>
  );
}

export default Inventory;

{
  /* <div className="alchemy">
          e000:  e001:  e002:  e003:  e004:  e005:  e006:  e007:  e008:
           e009:  e00a:  e00b:  e00c:  e00d:  e00e:  e00f:  e010: 
          e011:  e012:  e013:  e014:  e015:  e016:  e017:  e018:  e019:
           e01a:  e01b:  e01c:  e01d:  e01e:  e01f:  e020:  e021: 
          e022:  e023:  e024:  e025:  e026:  e027:  e028:  e029:  e02a:
           e02b:  e02c:  e02d:  e02e:  e02f:  e030:  e031:  e032: 
          e033:  e034:  e035:  e036:  e037:  e038:  e039:  e03a:  e03b:
           e03c:  e03d:  e03e:  e03f:  e040:  e041:  e042:  e043: 
          e044:  e045:  e046:  e047:  e048:  e049:  e04a:  e04b:  e04c:
           e04d:  e04e:  e04f:  e050:  e051:  e052:  e053:  e054: 
          e055:  e056:  e057:  e058:  e059:  e05a:  e05b:  e05c:  e05d:
           e05e:  e05f:  e060:  e061:  e062:  e063:  e064:  e065: 
          e066:  e067:  e068:  e069:  e06a:  e06b:  e06c:  e06d:  e06e:
          
        </div> */
}
