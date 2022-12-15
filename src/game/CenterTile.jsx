import _ from "lodash";
import React, { useCallback } from "react";
import SVG from "react-inlinesvg";
import { ROOM_TYPES } from "../data/constants";
import { useGame, useGameDispatch } from "../state/GameContext";
import DialogueBox from "./components/DialogueBox";
import Svg from "./components/Svg";
import Cage from "./img/cage.svg";
import { CaptiveImage } from "./img/Captive";
import Chest from "./img/chest.svg";
import Flasks from "./img/flasks.svg";
import { GET_MONSTER_IMAGE } from "./img/Monster";
import { Item } from "./Item";

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

function CenterTileContentContainer({ toggleOpen, children }) {
  return (
    <div
      className="flex items-center justify-center relative h-full w-full p-2"
      onClick={toggleOpen}
    >
      {children}
    </div>
  );
}

function useOpen(initialState = false) {
  const [open, setOpen] = React.useState(initialState);

  const toggleOpen = () => {
    setOpen((o) => !o);
  };

  return { open, toggleOpen };
}

function MonsterTileContents({ monster, room }) {
  const satiety = _.round(100 - (monster.hunger / monster.maxHunger) * 100, 2);
  return (
    <div>
      {monster.sated ? (
        <div>
          {monster.name}: I'm full. You go ahead.
          {!monster.hasKeyTo ? null : " Here's a key."}
        </div>
      ) : satiety > 0 ? (
        <div>
          {monster.name}: I'm only {satiety}% full. You must feed me treasure to
          pass.
        </div>
      ) : (
        <div>{monster.name}: I am very hungry.</div>
      )}
    </div>
  );
}

export function MonsterTile({ room }) {
  const { roomMonsters, previousRoom } = useGame();
  const monster = roomMonsters[room.id];
  const { open, toggleOpen } = useOpen(
    !monster.sated && previousRoom?.id !== room.id
  );

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <Svg
          source={GET_MONSTER_IMAGE(monster.image)}
          width={"100%"}
          height="80%"
        />
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <MonsterTileContents {...{ monster, room }} />
      </DialogueBox>
    </>
  );
}

function ContainerModalContents({
  currentRoom,
  currentRoomItems,
  handleTakeItem,
}) {
  const itemList = currentRoomItems.filter((item) => item.quantity > 0);

  return itemList.length <= 0 ? (
    <div>{currentRoom.containerName} is empty!</div>
  ) : (
    <div className="flex flex-wrap items-center gap-1 content-start">
      {itemList.map((item) => {
        return (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              handleTakeItem(item);
            }}
            className={`flex items-center justify-start whitespace-pre disabled:opacity-50 border-solid border border-gray-700 rounded-md pr-1`}
          >
            <Item item={item} />
            <div className="text-xs">x {item.quantity}</div>
          </button>
        );
      })}
    </div>
  );
}

export function LabTile({ room }) {
  const { learnedRecipeIds, learnedRecipes, inventory } = useGame();
  const dispatch = useGameDispatch();
  const { open, toggleOpen } = useOpen();

  const hasIngredients = useCallback(
    (recipe) => {
      return recipe.ingredients.every((i) => {
        return inventory[i.itemId].quantity >= i.quantity;
      });
    },
    [inventory]
  );

  const hasIngredient = useCallback(
    (ingredient) => {
      return inventory[ingredient.itemId].quantity >= ingredient.quantity;
    },
    [inventory]
  );

  const handleCombineItems = (recipeId) => {
    dispatch({
      type: "combineItems",
      payload: { recipeId },
    });
  };

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <Svg source={Flasks} width={"100%"} height="80%" />
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <div className="flex flex-col items-center justify-center">
          {!learnedRecipeIds.length ? (
            <span>You haven't learned any recipes yet...</span>
          ) : (
            learnedRecipes.map((r) => {
              return (
                <div
                  className="flex items-center justify-center  mb-1"
                  key={r.id}
                >
                  {r.ingredients.map((ingredient, i) => (
                    <div
                      className="flex items-center justify-center whitespace-pre"
                      key={`${ingredient.id}-${i}`}
                    >
                      <div
                        className={`flex items-center justify-start whitespace-pre pr-1 mx-1`}
                        style={
                          hasIngredient(ingredient) ? {} : { opacity: 0.5 }
                        }
                      >
                        <Item item={inventory[ingredient.itemId]} />
                        <div className="text-xs">x {ingredient.quantity}</div>
                      </div>
                      {i < r.ingredients.length - 1 ? (
                        <div>+</div>
                      ) : (
                        <div>=</div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCombineItems(r.id);
                    }}
                    disabled={!hasIngredients(r)}
                    className="border border-white rounded-md border-solid whitespace-pre p-1 ml-2 disabled:opacity-50"
                  >
                    {inventory[r.id].symbol}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </DialogueBox>
    </>
  );
}

export function LevelExitTile({ room }) {
  const { open, toggleOpen } = useOpen();

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        Exit!
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <div>You have reached the exit!</div>
      </DialogueBox>
    </>
  );
}

export function ContainerTile({ room }) {
  const { roomItems, previousRoom } = useGame();
  const dispatch = useGameDispatch();
  const currentRoomItems = roomItems[room.id].filter(
    (item) => item.quantity > 0
  );
  const { open, toggleOpen } = useOpen(
    currentRoomItems.length > 0 && room.id !== previousRoom?.id
  );

  const handleTakeItem = (item) => {
    dispatch({
      type: "addToInventoryFromRoom",
      payload: { itemId: item.itemId, quantity: 1 },
    });
  };

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <Svg source={Chest} width="100%" height="80%" />
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <ContainerModalContents
          {...{ currentRoom: room, currentRoomItems, handleTakeItem }}
        />
      </DialogueBox>
    </>
  );
}

export function CaptiveTile({ room }) {
  const { captives, haveKeysTo } = useGame();
  const dispatch = useGameDispatch();
  const captive = captives[room.id];
  const haveKey = haveKeysTo.includes(captive.id);

  const { open, toggleOpen } = useOpen();

  const handleFreeCaptive = () => {
    dispatch({
      type: "freeCaptive",
      payload: { roomId: room.id },
    });
  };

  return (
    <>
      <CenterTileContentContainer toggleOpen={toggleOpen}>
        <div className="top-0 left-0 absolute w-full h-full flex items-center justify-center text-white z-40">
          <Svg source={Cage} />
        </div>
        {!captive.freed ? (
          <div className="top-0 left-0 absolute w-full h-full flex items-center justify-center text-white z-30">
            <CaptiveImage captive={captive} width="80%" />
          </div>
        ) : null}
      </CenterTileContentContainer>
      <DialogueBox onClick={toggleOpen} isOpen={open} roomId={room.id}>
        <div className="flex flex-col justify-center items-center align-center gap-2">
          {!captive.freed ? (
            haveKey ? (
              <>
                <div>I can teach you a recipe!</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFreeCaptive();
                  }}
                  disabled={!haveKey}
                  className="rounded-sm border border-white border-solid p-1 whitespace-pre w-min"
                >
                  Free me!
                </button>
              </>
            ) : (
              <>Need key</>
            )
          ) : (
            <>An empty cage...</>
          )}
        </div>
      </DialogueBox>
    </>
  );
}
