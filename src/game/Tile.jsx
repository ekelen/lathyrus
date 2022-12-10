import React, { useEffect, useRef } from "react";
import { ROOM_SIZE } from "../data/constants";
import { useGame, useGameDispatch } from "../state/GameContext";
import pine00 from "./img/trees/pine00.png";
import pine01 from "./img/trees/pine01.png";
import pine02 from "./img/trees/pine02.png";
import pine04 from "./img/trees/pine04.png";
import InteractiveTooltip from "./components/InteractiveTooltip";
import _ from "lodash";
import { getPositionFromCoordinates } from "../data/util";
import Goblin from "./img/Goblin";
import SVG from "react-inlinesvg";
import Rabbit from "./img/rabbit.svg";
import Cage from "./img/cage.svg";

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
        backgroundColor: "rgb(4, 6, 8)",
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
        border: "1px solid transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0)",
        position: "relative",
        // zIndex: 30,
      }}
    >
      {room.lockedExitTilePositions.includes(position) ? (
        <>
          <span style={{ color: "red" }}>Locked</span>
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
        border: "1px solid transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          isCenter || isExitTile ? "rgba(0,200,255,0.2)" : "rgba(0,5,10,1)",
      }}
    >
      {isCenter ? (
        room.type === "container" ? (
          <ContainerTile room={room} />
        ) : room.type === "monster" ? (
          <MonsterTile room={room} />
        ) : room.type === "captive" ? (
          <CaptiveTile room={room} />
        ) : null
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
        <div>{monster.name}: I'm full. You go ahead.</div>
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
  const prevRoomIdRef = useRef(null);

  const { roomItems, roomMonsters } = useGame();
  const currentRoomMonster = roomMonsters[room.id];
  const currentRoomItems = roomItems[room.id];
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    let timer;
    if (containerRef.current && prevRoomIdRef.current === room.id) {
      containerRef.current.style.borderColor = "yellow";
      timer = setTimeout(() => {
        containerRef.current.style.borderColor = "transparent";
      }, 500);
    }
    if (prevRoomIdRef.current !== room.id) {
      prevRoomIdRef.current = room.id;
      clearTimeout(timer);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [currentRoomItems, room.id]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          onClick={() => setOpen((o) => !o)}
          ref={containerRef}
          style={{ padding: "1rem" }}
        >
          {currentRoomMonster.image === "goblin" ? (
            <Goblin />
          ) : (
            currentRoomMonster.name
          )}
        </div>
      </div>
      <InteractiveTooltip
        onClick={() => setOpen((o) => !o)}
        isOpen={open}
        roomId={room.id}
        style={{ bottom: 0, top: "unset" }}
      >
        <MonsterTileContents {...{ monster: currentRoomMonster, room }} />
      </InteractiveTooltip>
    </div>
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
            console.log(`[=] Taking item ${item.name}x${item.quantity}`);
            handleTakeItem(item);
          }}
        >
          {item.name}x{item.quantity}
        </button>
      );
    })
  );
}

function ContainerTile({ room }) {
  const containerRef = useRef(null);
  const prevRoomIdRef = useRef(null);
  const { roomItems } = useGame();
  const dispatch = useGameDispatch();
  const currentRoomItems = roomItems[room.id].filter(
    (item) => item.quantity > 0
  );
  const [open, setOpen] = React.useState(false);

  const handleTakeItem = (item) => {
    dispatch({
      type: "addToInventoryFromRoom",
      payload: { itemId: item.itemId, quantity: 1 },
    });
  };

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

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          ref={containerRef}
          disabled={currentRoomItems.length === 0}
        >
          {room.containerName}
          {currentRoomItems.length === 0 && <div>[empty]</div>}
        </button>
      </div>
      <InteractiveTooltip
        onClick={() => setOpen((o) => !o)}
        isOpen={open}
        roomId={room.id}
        style={{ top: "100%" }}
      >
        <ContainerModalContents
          {...{ currentRoom: room, currentRoomItems, handleTakeItem }}
        />
      </InteractiveTooltip>
    </div>
  );
}

function CaptiveTile({ room }) {
  const containerRef = useRef(null);
  const prevRoomIdRef = useRef(null);
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

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <div onClick={() => setOpen((o) => !o)} ref={containerRef} style={{}}>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
            <SVG src={Cage} width={128} height="auto" title="React" />
          </div>
          <div style={{ position: "absolute", height: "100%", width: "100%" }}>
            {!captive.freed ? (
              captive.id === "rabbit" ? (
                <SVG src={Rabbit} width={128} height="auto" title="React" />
              ) : (
                captive.name
              )
            ) : null}
          </div>
        </div>
      </div>
      <InteractiveTooltip
        onClick={() => setOpen((o) => !o)}
        isOpen={open}
        roomId={room.id}
        style={{ bottom: 0, top: "unset" }}
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
    </div>
  );
}

export default RoomTile;
