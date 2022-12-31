import React from "react";

import { useGame, useGameDispatch } from "../state/GameContext";
import { CaptiveRecipeHint } from "./inventoryArea/CaptiveRecipeHint";
import { InventoryItems } from "./inventoryArea/InventoryItems";
import { Keys } from "./inventoryArea/Keys";
import { Captives } from "./inventoryArea/Captives";
import Key from "./img/key.svg";
import Cage from "./img/cage.svg";
import Svg from "./components/Svg";
import Scroll from "./img/scroll.svg";
import Chest from "./img/chest2.svg";
import { Recipes } from "./inventoryArea/Recipes";
import { RecipeHint } from "./inventoryArea/RecipeHint";
import { FeedCaptiveConfirm } from "./inventoryArea/FeedCaptiveConfirm";

function Inventory() {
  const {
    inventoryById,
    currentRoom,
    freedCaptiveList,
    currentRoomMonster,
    haveKeysTo,
    captivesByRoomId,
    maxInventory,
    totalInventoryQuantity,
    learnedRecipeIds,
  } = useGame();
  const { type } = currentRoom;
  const dispatch = useGameDispatch();
  const [selectedCaptiveId, setSelectedCaptiveId] = React.useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = React.useState(null);

  return (
    <div className="flex h-36 w-full mt-2 mb-10 gap-1 relative">
      <div className="flex flex-col items-center relative h-full w-10 border-2 border-slate-700 border-double rounded-md">
        <Keys
          captivesByRoomId={captivesByRoomId}
          haveKeysTo={haveKeysTo}
          currentRoomId={currentRoom.id}
          dispatch={dispatch}
        />
        <div className="absolute bottom-0 left-1/2 border rounded-md text-xs bg-black text-slate-500 border-slate-500 translate-y-1/2 -translate-x-1/2 p-0.5 h-5 w-5 flex items-center justify-center">
          <Svg source={Key} height="70%" width="100%" />
        </div>
      </div>
      <div className="flex flex-col flex-wrap relative h-full w-10 border-2 border-slate-700 border-double rounded-md items-center">
        <Captives
          freedCaptiveList={freedCaptiveList}
          selectedCaptiveId={selectedCaptiveId}
          setSelectedCaptiveId={setSelectedCaptiveId}
          currentRoom={currentRoom}
        />
        <div className="absolute bottom-0 left-1/2 border rounded-md text-xs bg-black text-slate-500 border-slate-500 translate-y-1/2 -translate-x-1/2 p-0.5 h-5 w-5 flex items-center justify-center">
          <Svg source={Cage} height="80%" width="100%" />
        </div>
      </div>
      <div className="flex flex-col flex-wrap relative h-full w-10 border-2 border-slate-700 border-double rounded-md items-center">
        <Recipes
          learnedRecipeIds={learnedRecipeIds}
          setSelectedRecipeId={setSelectedRecipeId}
          selectedRecipeId={selectedRecipeId}
        />
        <div className="absolute bottom-0 left-1/2 border rounded-md text-xs bg-black text-slate-500 border-slate-500 translate-y-1/2 -translate-x-1/2 p-0.5 h-5 w-5 flex items-center justify-center">
          <Svg source={Scroll} height="80%" width="100%" />
        </div>
      </div>
      <div className="flex flex-col flex-wrap h-full p-2  grow border-2 border-slate-700 border-double rounded-md align-start content-start justify-start relative">
        <InventoryItems
          inventoryById={inventoryById}
          type={type}
          currentRoomMonster={currentRoomMonster}
          dispatch={dispatch}
        />
        <div className="absolute bottom-0 left-1/2 border rounded-md text-xs bg-black text-slate-500 border-slate-500 translate-y-1/2 -translate-x-1/2 py-0.5 px-2 h-5 flex items-center justify-center gap-2">
          <Svg source={Chest} /> {totalInventoryQuantity}/{maxInventory}
        </div>
      </div>
      <CaptiveRecipeHint
        selectedCaptiveId={selectedCaptiveId}
        captivesByRoomId={captivesByRoomId}
        setSelectedCaptiveId={setSelectedCaptiveId}
      />
      <FeedCaptiveConfirm
        selectedCaptiveId={selectedCaptiveId}
        captivesByRoomId={captivesByRoomId}
        setSelectedCaptiveId={setSelectedCaptiveId}
      />
      <RecipeHint
        selectedRecipeId={selectedRecipeId}
        setSelectedRecipeId={setSelectedRecipeId}
      />
    </div>
  );
}

export default Inventory;
