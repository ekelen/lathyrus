import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { ROOM_SIZE } from "../data/setup";
import { useGame, useGameDispatch } from "../state/GameContext";
import { getRoomGradient } from "./color";
import RoomTile from "./Tile";

const FRAME_WIDTH = "2rem";

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

export default RoomFrame;
