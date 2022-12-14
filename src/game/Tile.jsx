import React, { useEffect, useRef } from "react";
import { ROOM_SIZE, ROOM_TYPES } from "../data/constants";
import { useGame, useGameDispatch } from "../state/GameContext";
import pine00 from "./img/trees/pine00.png";
import pine01 from "./img/trees/pine01.png";
import pine02 from "./img/trees/pine02.png";
import pine04 from "./img/trees/pine04.png";
import InteractiveTooltip from "./components/InteractiveTooltip";
import _ from "lodash";
import { getPositionFromCoordinates } from "../data/util";
import SVG from "react-inlinesvg";
import Cage from "./img/cage.svg";
import Flasks from "./img/flasks.svg";
import Chest from "./img/chest.svg";
import { BLACK } from "./color";
import { GET_CAPTIVE_IMAGE } from "./img/Captive";
import { GET_MONSTER_IMAGE } from "./img/Monster";

const TREE_IMG = [pine00, pine01, pine02, pine04];

function RoomDeadspaceTile({ room, position }) {
  return (
    <div
      style={{
        backgroundImage: `url('${
          TREE_IMG[
            (position + room.coordinates.x + room.coordinates.y) %
              TREE_IMG.length
          ]
        }')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        height: "100%",
        width: "100%",
        backgroundColor: BLACK,
      }}
    ></div>
  );
}

function ExitTile({ room, position }) {
  return (
    <div
      key={`${room.id}-${position}`}
      style={{
        height: "100%",
        width: `100%`,
        border: "1px solid rgba(255,255,255,0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0)",
      }}
    >
      {room.lockedExitTilePositions.includes(position) ? (
        <>
          <span style={{ color: "red" }}></span>
        </>
      ) : null}
    </div>
  );
}

function RoomTile({ row, col, room }) {
  const position = getPositionFromCoordinates(col, row);
  const isCenter = position === room.centerPosition;
  const isExitTile = room.exitTilePositions.includes(position);
  return (
    <div
      key={col}
      style={{
        height: "100%",
        width: `calc(100% / ${ROOM_SIZE})`,
        border: "0px solid rgba(255,255,255,0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          isCenter || isExitTile ? "rgba(0,200,255,0.2)" : "rgba(0,5,10,1)",
      }}
    >
      {isCenter ? (
        <CenterTile type={room.type} room={room} />
      ) : isExitTile ? (
        <ExitTile {...{ room, position }} />
      ) : (
        <RoomDeadspaceTile {...{ room, position }} />
      )}
    </div>
  );
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

function MonsterTile({ room }) {
  const containerRef = useRef(null);

  const { roomMonsters, previousRoom } = useGame();
  const monster = roomMonsters[room.id];
  const [open, setOpen] = React.useState(
    !monster.sated && previousRoom?.id !== room.id
  );

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "0.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <SVG
          src={GET_MONSTER_IMAGE(monster.image)}
          width={"100%"}
          height="auto"
          title="React"
        />
      </div>
      <InteractiveTooltip
        onClick={() => setOpen((o) => !o)}
        isOpen={open}
        roomId={room.id}
      >
        <MonsterTileContents {...{ monster, room }} />
      </InteractiveTooltip>
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
    itemList.map((item) => {
      return (
        <button
          key={item.id}
          onClick={(e) => {
            e.stopPropagation();
            handleTakeItem(item);
          }}
        >
          {item.name}x{item.quantity}
        </button>
      );
    })
  );
}

function LabTile({ room }) {
  const containerRef = useRef(null);
  const { learnedRecipes, previousRoom } = useGame();
  const dispatch = useGameDispatch();
  const [open, setOpen] = React.useState(false);

  const handleCombineItems = (recipeId) => {
    dispatch({
      type: "combineItems",
      payload: { recipeId },
    });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "0.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <SVG src={Flasks} width={"100%"} height="auto" title="React" />
      </div>
      <InteractiveTooltip
        onClick={() => setOpen((o) => !o)}
        isOpen={open}
        roomId={room.id}
      >
        <div>
          {!learnedRecipes.length ? (
            <span>You haven't learned any recipes yet...</span>
          ) : (
            learnedRecipes.map((r) => {
              return <button onClick={() => handleCombineItems(r)}>{r}</button>;
            })
          )}
        </div>
      </InteractiveTooltip>
    </>
  );
}

function ContainerTile({ room }) {
  const containerRef = useRef(null);
  const { roomItems, previousRoom } = useGame();
  const dispatch = useGameDispatch();
  const currentRoomItems = roomItems[room.id].filter(
    (item) => item.quantity > 0
  );
  const [open, setOpen] = React.useState(
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
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0.5rem",
        }}
        onClick={() => setOpen((o) => !o)}
        ref={containerRef}
      >
        <SVG src={Chest} width={"100%"} height="auto" title="React" />
      </div>
      <InteractiveTooltip
        onClick={() => setOpen((o) => !o)}
        isOpen={open}
        roomId={room.id}
      >
        <ContainerModalContents
          {...{ currentRoom: room, currentRoomItems, handleTakeItem }}
        />
      </InteractiveTooltip>
    </>
  );
}

function CaptiveTile({ room }) {
  const containerRef = useRef(null);
  const { captives, haveKeysTo } = useGame();
  const dispatch = useGameDispatch();
  const captive = captives[room.id];
  const haveKey = haveKeysTo.includes(captive.id);

  const [open, setOpen] = React.useState(false);

  const handleFreeCaptive = () => {
    dispatch({
      type: "freeCaptive",
      payload: { roomId: room.id },
    });
  };

  return (
    <>
      <div
        onClick={() => {
          setOpen((o) => !o);
        }}
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 31,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG src={Cage} width={"100%"} height="auto" title="React" />
        </div>
        {!captive.freed ? (
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
              color: "white",
              zIndex: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG
              src={GET_CAPTIVE_IMAGE(captive.image)}
              width={"75%"}
              height="auto"
              title="React"
            />
          </div>
        ) : null}
      </div>
      <InteractiveTooltip
        onClick={() => setOpen((o) => !o)}
        isOpen={open}
        roomId={room.id}
      >
        <div>
          {!captive.freed ? (
            <button onClick={() => handleFreeCaptive()} disabled={!haveKey}>
              {haveKey ? <div>Free {captive.name}</div> : <div>Need key</div>}
            </button>
          ) : (
            <div>An empty cage...</div>
          )}
        </div>
      </InteractiveTooltip>
    </>
  );
}

function CenterTile({ room }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid rgba(255,255,255,0)",
        position: "relative",
      }}
    >
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
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default RoomTile;

// useEffect(() => {
//   let timer;
//   if (containerRef.current && prevRoomIdRef.current === room.id) {
//     containerRef.current.style.borderColor = "yellow";
//     timer = setTimeout(() => {
//       if (containerRef.current) {
//         containerRef.current.style.borderColor = "transparent";
//       }
//     }, 1000);
//   }
//   if (prevRoomIdRef.current !== room.id) {
//     prevRoomIdRef.current = room.id;
//   }
//   return () => {
//     clearTimeout(timer);
//   };
// }, [currentRoomItems, room.id]);
