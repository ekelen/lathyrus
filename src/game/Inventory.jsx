import _ from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";

import {
  CAPTIVE_LIST,
  ITEMS_BY_ID,
  RECIPES_BY_ID,
  ROOM_TYPES,
} from "../data/constants";
import { sortByName } from "../data/util";
import { useGame, useGameDispatch } from "../state/GameContext";
import { CaptiveImage } from "./components/Captive";
import {
  Item,
  ItemWithQuantity,
  ItemWithQuantityButton,
} from "./components/Item";
import Key from "./img/key.svg";
import Svg from "./components/Svg";
import DialogueBox from "./components/DialogueBox";
import { useOpen } from "./useOpen";

const KeyCodepoint = ({ className }) => (
  <div className={className}>&#x0e033;</div>
);

function Captives({ freedCaptiveList, selectedCaptive, setSelectedCaptive }) {
  return (
    <>
      {freedCaptiveList.map((captive) => {
        const { colorClass } = captive;
        return (
          <div
            className="flex items-center justify-center h-6 w-6 relative mx-2 mt-2 mb-0"
            key={captive.id}
            onClick={() => setSelectedCaptive(captive.id)}
          >
            <div className={`${colorClass}`}>
              <CaptiveImage captive={captive} color="currentColor" />
            </div>
          </div>
        );
      })}
    </>
  );
}

function Keys({ captivesByRoomId, haveKeysTo }) {
  return (
    <>
      {haveKeysTo
        .filter((captiveId) => !captivesByRoomId[captiveId]?.freed)
        .map((key, i) => {
          const captive = captivesByRoomId[key];
          const { colorClass } = captive;
          return (
            <div
              className="flex items-center justify-center h-6 w-6 mx-2 mt-2 mb-0 relative"
              key={`${i}-${key}`}
            >
              <div className={`h-5 w-5 relative alchemy ${colorClass}`}>
                {/* <KeyCodepoint className={`${colorClass}`} /> */}
                <Svg source={Key} height="70%" width="90%" />
              </div>
            </div>
          );
        })}
    </>
  );
}

function _Inventory({ inventoryById, type, currentRoomMonster, dispatch }) {
  const disabled = type !== ROOM_TYPES.monster || currentRoomMonster?.sated;

  const handleItemClick = useCallback(
    ({ item }) => {
      switch (type) {
        // case ROOM_TYPES.storage:
        //   dispatch({
        //     type: "addToStorageFromInventory",
        //     payload: { itemId: item.id, quantity: 1 },
        //   });
        //   break;
        case ROOM_TYPES.monster:
          dispatch({
            type: "feed",
            payload: { itemId: item.id },
          });
          break;
        default:
          break;
      }
    },
    [type, dispatch]
  );

  const inventoryValues = useMemo(
    () => _.values(inventoryById).filter((item) => item.quantity > 0),
    [inventoryById]
  );
  return (
    <>
      {inventoryValues.map((item) => {
        return (
          <ItemWithQuantityButton
            key={item.id}
            quantity={item.quantity}
            item={item}
            disabled={disabled}
            onClick={() => {
              handleItemClick({ item });
            }}
            wrapperClass="disabled:opacity-50"
          />
        );
      })}
    </>
  );
}

function Inventory(props) {
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
  const [selectedCaptive, setSelectedCaptive] = React.useState(null);
  const { open, toggleOpen, setOpen } = useOpen(false);
  console.log(`[=] captivesByRoomId:`, captivesByRoomId);
  const selectedCaptiveRecipe = useMemo(
    () =>
      !selectedCaptive
        ? null
        : RECIPES_BY_ID[captivesByRoomId[selectedCaptive]?.teaches?.recipeId] ??
          null,
    [selectedCaptive]
  );
  useEffect(() => {
    if (selectedCaptiveRecipe) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [freedCaptiveList, selectedCaptiveRecipe, setOpen]);

  React.useEffect(() => {
    console.log(`[=] selectedCaptive changed`);
    console.log(`[=] selectedCaptive:`, selectedCaptive);
    console.log(
      `[=] CAPTIVE_LIST[selectedCaptive]:`,
      captivesByRoomId[selectedCaptive]
    );
  }, [selectedCaptive]);

  return (
    <div className="flex h-28 w-100 mt-2 gap-1 relative">
      <div className="flex flex-col flex-wrap h-full p-2 grow border-2 border-slate-700 border-double rounded-md align-start content-start justify-start">
        <_Inventory
          inventoryById={inventoryById}
          type={type}
          currentRoomMonster={currentRoomMonster}
          dispatch={dispatch}
        />
        {/* <div className="alchemy">
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
        </div> */}
      </div>
      <div className="flex flex-col flex-wrap relative h-full w-10 border-2 border-slate-700 border-double rounded-md">
        <Keys captivesByRoomId={captivesByRoomId} haveKeysTo={haveKeysTo} />
      </div>
      <div className="flex flex-col flex-wrap relative h-full w-10 border-2 border-slate-700 border-double rounded-md">
        <Captives
          freedCaptiveList={freedCaptiveList}
          selectedCaptive={selectedCaptive}
          setSelectedCaptive={setSelectedCaptive}
        />
      </div>
      <DialogueBox
        onClick={() => setSelectedCaptive(null)}
        isOpen={open}
        style={{
          top: "unset",
          bottom: 0,
          left: 0,
          // right: 0,
          width: "100%",
          minWidth: "100%",
        }}
      >
        {!selectedCaptiveRecipe ? null : (
          <div className="flex items-center justify-center">
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
    </div>
  );
}

export default Inventory;
