import React, { useEffect, useRef } from "react";
import { useGame, useGameDispatch } from "../state/GameContext";
import _ from "lodash";
import {
  getPositionFromCoordinates,
  ROOM_HEIGHT,
  ROOM_WIDTH,
} from "../data/setup";
import Inventory from "./Inventory";
import Modal from "../Modal";

const FRAME_WIDTH = "2rem";

function MonsterTile(props) {
  const containerRef = useRef(null);
  const prevRoomIdRef = useRef(null);
  const { currentRoomItems, currentRoom, currentRoomMonster } = useGame();
  const dispatch = useGameDispatch();
  const [showModal, setShowModal] = React.useState(false);

  const handleFeed = (item) => {
    dispatch({
      type: "feed",
      payload: { itemId: item.itemId },
    });
  };

  useEffect(() => {
    let timer;
    if (containerRef.current && prevRoomIdRef.current === currentRoom.id) {
      containerRef.current.style.borderColor = "yellow";
      timer = setTimeout(() => {
        containerRef.current.style.borderColor = "transparent";
      }, 1000);
    }
    if (prevRoomIdRef.current !== currentRoom.id) {
      prevRoomIdRef.current = currentRoom.id;
    }
    return () => {
      clearTimeout(timer);
    };
  }, [currentRoomItems, currentRoom.id]);

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
      {showModal ? (
        <Modal onClose={() => setShowModal(false)}>
          {currentRoomMonster.name} - {currentRoomMonster.hunger}/
          {currentRoomMonster.maxHunger} hunger
          {/* <ContainerModalContents
              {...{ currentRoom, currentRoomItems, handleTakeItem }}
            /> */}
        </Modal>
      ) : (
        <button onClick={() => setShowModal(true)} ref={containerRef}>
          {currentRoomMonster.name}
        </button>
      )}
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
        <button key={item.id} onClick={() => handleTakeItem(item)}>
          {item.name}x{item.quantity}
        </button>
      );
    })
  );
}

function ContainerTile(props) {
  const containerRef = useRef(null);
  const prevRoomIdRef = useRef(null);
  const { currentRoomItems, currentRoom } = useGame();
  const dispatch = useGameDispatch();
  const [showModal, setShowModal] = React.useState(false);

  const handleTakeItem = (item) => {
    dispatch({
      type: "addToInventoryFromRoom",
      payload: { itemId: item.itemId, quantity: 1 },
    });
  };

  useEffect(() => {
    let timer;
    if (containerRef.current && prevRoomIdRef.current === currentRoom.id) {
      containerRef.current.style.borderColor = "yellow";
      timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.borderColor = "transparent";
        }
      }, 1000);
    }
    if (prevRoomIdRef.current !== currentRoom.id) {
      prevRoomIdRef.current = currentRoom.id;
    }
    return () => {
      clearTimeout(timer);
    };
  }, [currentRoomItems, currentRoom.id]);

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
      {showModal ? (
        <Modal onClose={() => setShowModal(false)}>
          <ContainerModalContents
            {...{ currentRoom, currentRoomItems, handleTakeItem }}
          />
        </Modal>
      ) : (
        <button onClick={() => setShowModal(true)} ref={containerRef}>
          {currentRoom.containerName}
        </button>
      )}
    </div>
  );
}

function Room() {
  const { currentRoom } = useGame();
  const commonStyle = {
    height: "100%",
    border: "1px solid violet",
    width: "100%",
  };

  return (
    <div style={commonStyle}>
      {_.range(ROOM_HEIGHT).map((row) => (
        <div
          key={row}
          style={{
            height: `calc(100% / ${ROOM_HEIGHT})`,
            width: "100%",
            display: "flex",
          }}
        >
          {_.range(ROOM_WIDTH).map((col) => {
            const position = getPositionFromCoordinates(col, row);
            return (
              <div
                key={col}
                style={{
                  height: "100%",
                  width: `calc(100% / ${ROOM_WIDTH})`,
                  border: "1px solid blue",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    position === currentRoom.centerPosition ||
                    currentRoom.exitPositions.includes(position)
                      ? "rgba(255,0,255,0.3)"
                      : "black",
                }}
              >
                {currentRoom.type === "container" &&
                position === currentRoom.centerPosition ? (
                  <ContainerTile />
                ) : currentRoom.type === "monster" &&
                  position === currentRoom.centerPosition ? (
                  <MonsterTile />
                ) : (
                  "tile"
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const MoveButton = ({ exits, handleMove, direction }) => {
  return (
    <button
      onClick={() => handleMove(direction)}
      disabled={exits[direction] === null}
    >
      <span
        style={{
          transform: `rotate(${
            ["north", "east", "south", "west"].indexOf(direction) * 90
          }deg)`,
          display: "block",
        }}
      >
        &#8593;
      </span>
    </button>
  );
};

function RoomFrame() {
  const { currentRoom, previousRoom } = useGame();
  const dispatch = useGameDispatch();
  const { exits } = currentRoom;
  const handleMove = (direction) => {
    dispatch({ type: "move", payload: { direction } });
  };
  return (
    <div
      style={{
        height: "clamp(350px, 95vw, 450px)",
        border: "1px solid blue",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          height: FRAME_WIDTH,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MoveButton exits={exits} direction="north" handleMove={handleMove} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          flex: 1,
          //   position: "relative",
        }}
      >
        <div
          style={{
            width: FRAME_WIDTH,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <MoveButton exits={exits} direction="west" handleMove={handleMove} />
        </div>
        <Room />
        <div
          style={{
            width: FRAME_WIDTH,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <MoveButton exits={exits} direction="east" handleMove={handleMove} />
        </div>
      </div>
      <div
        style={{
          height: FRAME_WIDTH,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MoveButton exits={exits} direction="south" handleMove={handleMove} />
      </div>
    </div>
  );
}

function Game() {
  const { currentRoom } = useGame();
  const dispatch = useGameDispatch();
  return (
    <div
      style={{
        width: "clamp(350px, 95vw, 450px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        border: "1px solid yellow",
      }}
    >
      <div style={{ display: "flex" }}>
        <h1>{currentRoom.name}</h1>
        <button
          onClick={() => {
            dispatch({ type: "reset" });
          }}
        >
          Reset
        </button>
      </div>
      <RoomFrame />
      <Inventory />
    </div>
  );
}

export default Game;
