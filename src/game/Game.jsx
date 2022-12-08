import React, { useEffect, useRef } from "react";
import { ModalContext, useGame, useGameDispatch } from "../state/GameContext";
import _ from "lodash";
import { getPositionFromCoordinates, ROOM_SIZE } from "../data/setup";
import Inventory from "./Inventory";
import Modal from "../Modal";
import { getRoomGradient, rowGradients } from "./color";
import pine00 from "./img/trees/pine00.png";
import pine01 from "./img/trees/pine01.png";
import pine02 from "./img/trees/pine02.png";
// import pine03 from "./img/trees/pine03.png";
import pine04 from "./img/trees/pine04.png";
import { stripUnit } from "polished";
import { rgba } from "polished";

const FRAME_WIDTH = "2rem";
const TREE_IMG = [pine00, pine01, pine02, pine04];

const START_POSITION_CURRENT = {
  south: {
    top: "100%",
  },
  north: {
    top: "-100%",
  },
  east: {
    left: "100%",
  },
  west: {
    left: "-100%",
  },
};

const END_POSITION_PREVIOUS = {
  south: {
    top: "-100%",
  },
  north: {
    top: "100%",
  },
  east: {
    left: "-100%",
  },
  west: {
    left: "100%",
  },
};

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
      }}
    ></div>
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
        ) : null
      ) : isExitTile ? (
        room.lockedExitTilePositions.includes(position) ? (
          <span style={{ color: "red" }}>Locked</span>
        ) : null
      ) : (
        <RoomDeadspaceTile {...{ room, position }} />
      )}
    </div>
  );
}

function Room({ room, isPreviousRoom = false }) {
  const { direction } = useGame();
  const roomRef = useRef(null);

  const commonStyle = {
    height: "100%",
    width: "100%",
    ...getRoomGradient(room.coordinates.y),
    position: "absolute",
    transition: "left 1s ease, top 1s ease",
    zIndex: isPreviousRoom ? 5 : 20,
    borderWidth: "0px",
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0)",
    left:
      isPreviousRoom || !direction
        ? 0
        : START_POSITION_CURRENT[direction].left ?? 0,
    top:
      isPreviousRoom || !direction
        ? 0
        : START_POSITION_CURRENT[direction].top ?? 0,
  };

  useEffect(() => {
    let timer;
    console.log(
      `[=] remounting room ${room.id} - isPreviousRoom: ${isPreviousRoom}`
    );
    if (roomRef.current && isPreviousRoom) {
      timer = setTimeout(() => {
        roomRef.current.style.left = `${
          END_POSITION_PREVIOUS[direction].left ?? 0
        }`;
        roomRef.current.style.top = `${
          END_POSITION_PREVIOUS[direction].top ?? 0
        }`;
      }, 10);
    }
    if (roomRef.current && !isPreviousRoom) {
      timer = setTimeout(() => {
        roomRef.current.style.left = `0px`;
        roomRef.current.style.top = `0px`;
      }, 10);
    }
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={commonStyle} ref={roomRef}>
      {_.range(ROOM_SIZE).map((row) => (
        <div
          key={row}
          style={{
            height: `calc(100% / ${ROOM_SIZE})`,
            width: "100%",
            display: "flex",
          }}
        >
          {_.range(ROOM_SIZE).map((col) => {
            return (
              <RoomTile key={`${col}-${row}`} row={row} col={col} room={room} />
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
      style={{
        height: "2rem",
        width: "2rem",
        padding: "0.2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
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

function RoomWrapper({ children }) {
  const style = {
    height: "100%",
    border: `0px solid rgba(255,255,255,0)`,
    width: "100%",
    position: "relative",
    overflowX: "hidden",
    overflowY: "hidden",
  };
  return <div style={style}>{children}</div>;
}

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
        border: "1px solid rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        zIndex: 10,
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
        <RoomWrapper>
          {previousRoom && (
            <Room
              room={previousRoom}
              isPreviousRoom={true}
              key={previousRoom.id + "prev"}
            />
          )}
          <Room
            room={currentRoom}
            isPreviousRoom={false}
            key={currentRoom.id}
          />
        </RoomWrapper>
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
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>{currentRoom.name}</h3>
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

function MonsterTile({ room }) {
  const containerRef = useRef(null);
  const prevRoomIdRef = useRef(null);

  const { roomItems, roomMonsters } = useGame();
  const currentRoomMonster = roomMonsters[room.id];
  const currentRoomItems = roomItems[room.id];

  const { showModal, handleShowModal } = React.useContext(ModalContext);

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
      {showModal ? (
        <Modal onClose={() => handleShowModal(false)}>
          {currentRoomMonster.name} - {currentRoomMonster.hunger}/
          {currentRoomMonster.maxHunger} hunger
        </Modal>
      ) : (
        <button onClick={() => handleShowModal(true)} ref={containerRef}>
          {currentRoomMonster.name} - {currentRoomMonster.hunger}/
          {currentRoomMonster.maxHunger}
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

function ContainerTile({ room }) {
  const containerRef = useRef(null);
  const prevRoomIdRef = useRef(null);
  const { roomItems } = useGame();
  const dispatch = useGameDispatch();
  const { showModal, handleShowModal } = React.useContext(ModalContext);
  const currentRoomItems = roomItems[room.id];

  const handleTakeItem = (item) => {
    dispatch({
      type: "addToInventoryFromRoom",
      payload: { itemId: item.itemId, quantity: 1 },
    });
  };

  useEffect(() => {
    let timer;
    if (containerRef.current && prevRoomIdRef.current === room.id) {
      containerRef.current.style.borderColor = "yellow";
      timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.borderColor = "transparent";
        }
      }, 1000);
    }
    if (prevRoomIdRef.current !== room.id) {
      prevRoomIdRef.current = room.id;
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
      {showModal ? (
        <Modal onClose={() => handleShowModal(false)}>
          <ContainerModalContents
            {...{ currentRoom: room, currentRoomItems, handleTakeItem }}
          />
        </Modal>
      ) : (
        <button onClick={() => handleShowModal(true)} ref={containerRef}>
          {room.containerName}
        </button>
      )}
    </div>
  );
}

export default Game;
