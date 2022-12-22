import _ from "lodash";
import React, { useCallback, useMemo } from "react";

import { ITEMS_BY_ID, RECIPES_BY_ID } from "../data/gameData";
import { useGame, useGameDispatch } from "../state/GameContext";
import { CaptiveImage } from "./components/Captive";
import DialogueBox from "./components/DialogueBox";
import {
  Item,
  ItemWithQuantity,
  ItemWithQuantityButton,
} from "./components/Item";
import Svg from "./components/Svg";
import Key from "./img/key.svg";
import Flasks from "./img/flasks.svg";
import { ROOM_TYPES } from "../data/constants";

const KeyCodepoint = ({ className }) => (
  <div className={className}>&#x0e033;</div>
);

function Captives({
  freedCaptiveList,
  selectedCaptiveId,
  setSelectedCaptiveId,
}) {
  return (
    <>
      {freedCaptiveList.map((captive) => {
        const { colorClass } = captive;
        return (
          <button
            className="flex items-center justify-center h-6 w-6 relative mx-1 mt-2 mb-0 rounded-md bg-slate-800 p-1"
            key={captive.id}
            onClick={() =>
              setSelectedCaptiveId(
                captive.id === selectedCaptiveId ? null : captive.id
              )
            }
          >
            <div className={`${colorClass} w-full`}>
              <CaptiveImage captive={captive} color="currentColor" />
            </div>
          </button>
        );
      })}
    </>
  );
}

function Keys({ captivesByRoomId, haveKeysTo, currentRoomId, dispatch }) {
  const handleFreeCaptive = ({ keyTo }) => {
    dispatch({
      type: "freeCaptive",
      payload: { roomId: keyTo },
    });
  };

  return (
    <>
      {haveKeysTo
        .filter((captiveId) => !captivesByRoomId[captiveId]?.freed)
        .map((key, i) => {
          const captive = captivesByRoomId[key];
          const { colorClass } = captive;
          return (
            <button
              className={`flex items-center justify-center h-6 w-6 relative mx-1 mt-2 mb-0 rounded-md bg-slate-800 p-1 disabled:bg-transparent`}
              key={`${i}-${key}`}
              disabled={currentRoomId !== captive.id || captive.freed}
              onClick={() => handleFreeCaptive({ keyTo: captive.id })}
            >
              <div
                className={`relative alchemy w-full h-full flex items-center justify-center ${colorClass}`}
              >
                {/* <KeyCodepoint className={`${colorClass}`} /> */}
                <Svg source={Key} height="70%" width="100%" />
              </div>
            </button>
          );
        })}
    </>
  );
}

function InventoryItems({ inventoryById, type, currentRoomMonster, dispatch }) {
  const disabled = currentRoomMonster?.sated;

  const handleItemClick = useCallback(
    ({ itemId }) => {
      switch (type) {
        case ROOM_TYPES.monster:
          dispatch({
            type: "feed",
            payload: { itemId },
          });
          break;
        default:
          break;
      }
    },
    [type, dispatch]
  );

  const inventoryKeys = useMemo(
    () => _.keys(_.pickBy(inventoryById, (item) => item > 0)),
    [inventoryById]
  );
  const itemValues = useMemo(
    () => _.pick(ITEMS_BY_ID, inventoryKeys),
    [inventoryKeys]
  );
  return (
    <>
      {inventoryKeys.map((itemId) => {
        return (
          <ItemWithQuantityButton
            key={itemId}
            quantity={inventoryById[itemId]}
            item={itemValues[itemId]}
            disabled={disabled}
            onClick={() => {
              handleItemClick({ itemId });
            }}
            wrapperClass="disabled:opacity-50"
          />
        );
      })}
    </>
  );
}

function CaptiveRecipeHint({
  setSelectedCaptiveId,
  selectedCaptiveId,
  captivesByRoomId,
}) {
  const selectedCaptive = useMemo(
    () => (selectedCaptiveId ? captivesByRoomId[selectedCaptiveId] : null),
    [selectedCaptiveId, captivesByRoomId]
  );
  const selectedCaptiveRecipe = useMemo(
    () =>
      !selectedCaptive ? null : RECIPES_BY_ID[selectedCaptive.teaches.recipeId],
    [selectedCaptive]
  );
  const captiveColorClass = useMemo(
    () => (selectedCaptive ? selectedCaptive.colorClass : ""),
    [selectedCaptive]
  );

  return (
    <DialogueBox
      onClick={() => setSelectedCaptiveId(null)}
      isOpen={!!selectedCaptiveRecipe}
      style={{
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100%",
        minWidth: "100%",
      }}
    >
      {!selectedCaptiveRecipe ? null : (
        <div className="flex items-center justify-center">
          <div className={`${captiveColorClass} h-6 w-6 relative`}>
            <CaptiveImage
              height="80%"
              width="100%"
              captive={selectedCaptive}
              color="currentColor"
            />
          </div>
          <div>:</div>
          {selectedCaptiveRecipe.ingredients.map((ingredient, i) => (
            <div
              className="flex items-center justify-center whitespace-pre"
              key={`${ingredient.id}-${i}`}
            >
              <ItemWithQuantity
                item={ITEMS_BY_ID[ingredient.itemId]}
                quantity={ingredient.quantity}
              />
              {i < selectedCaptiveRecipe.ingredients.length - 1 ? (
                <div>+</div>
              ) : (
                <div>=</div>
              )}
            </div>
          ))}
          <div className="ml-1">
            <Item item={ITEMS_BY_ID[selectedCaptiveRecipe.id]} />
          </div>
        </div>
      )}
    </DialogueBox>
  );
}

function Inventory() {
  const {
    inventoryById,
    currentRoom,
    freedCaptiveList,
    currentRoomMonster,
    haveKeysTo,
    captivesByRoomId,
    maxInventory,
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
