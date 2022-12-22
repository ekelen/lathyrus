import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { ROOM_SIZE } from "../data/constants";
import { useGame, useGameDispatch } from "../state/GameContext";
import RoomTile from "./tile/Tile";

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
  const { movedCameraToOnTransition } = useGame();
  const roomRef = useRef(null);

  const commonStyle = {
    height: "100%",
    width: "100%",
    // ...getRoomGradient(room.coordinates.y),
    position: "absolute",
    transition: "left 750ms ease, top 750ms ease",
    zIndex: isPreviousRoom ? 5 : 20,
    borderWidth: "0px",
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0)",
    left:
      isPreviousRoom || !movedCameraToOnTransition
        ? 0
        : START_POSITION_CURRENT[movedCameraToOnTransition].left ?? 0,
    top:
      isPreviousRoom || !movedCameraToOnTransition
        ? 0
        : START_POSITION_CURRENT[movedCameraToOnTransition].top ?? 0,
  };

  useEffect(() => {
    let timer;
    // console.log(
    //   `[=] remounting room ${room.id} - isPreviousRoom: ${isPreviousRoom}`
    // );
    if (roomRef.current && isPreviousRoom) {
      timer = setTimeout(() => {
        roomRef.current.style.left = `${
          END_POSITION_PREVIOUS[movedCameraToOnTransition].left ?? 0
        }`;
        roomRef.current.style.top = `${
          END_POSITION_PREVIOUS[movedCameraToOnTransition].top ?? 0
        }`;
      }, 10);
    } else if (roomRef.current && !isPreviousRoom) {
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
      {[...Array(ROOM_SIZE).keys()].map((row) => (
        <div
          key={row}
          className="flex w-full"
          style={{
            height: `calc(100% / ${ROOM_SIZE})`,
          }}
        >
          {[...Array(ROOM_SIZE).keys()].map((col) => {
            return (
              <RoomTile key={`${col}-${row}`} row={row} col={col} room={room} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function RoomWrapper({ children }) {
  const style = {
    height: "100%",
    border: `1px solid rgba(255,255,255,0)`,
    width: "100%",
    position: "relative",
    overflowX: "hidden",
    overflowY: "hidden",
  };
  return (
    <div style={style}>
      <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-b from-black to-transparent z-50" />
      <div className="absolute bottom-0 left-0 w-full h-2.5 bg-gradient-to-t from-black to-transparent z-50" />
      <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-r from-black to-transparent z-50" />
      <div className="absolute top-0 right-0 w-2.5 h-full bg-gradient-to-l from-black to-transparent z-50" />
      {children}
    </div>
  );
}

function RoomFrame() {
  const { currentRoom, previousRoom, movedCameraToOnTransition } = useGame();
  const dispatch = useGameDispatch();
  const {
    exits,
    lockedDirections = [],
    // moveCameraToOnTransition = null,
  } = currentRoom;
  const handleMove = (direction) => {
    dispatch({ type: "move", payload: { direction } });
  };
  return (
    <div
      className="flex flex-col items-stretch relative z-10"
      style={{
        height: "clamp(350px, 95vw, 450px)",
        border: "1px solid rgba(255,255,255,0)",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          height: FRAME_WIDTH,
        }}
      >
        <MoveButton
          exits={exits}
          direction="north"
          handleMove={handleMove}
          lockedDirections={lockedDirections}
        />
      </div>
      <div className="flex items-stretch flex-1">
        <div
          className="flex items-center justify-center"
          style={{
            width: FRAME_WIDTH,
          }}
        >
          <MoveButton
            exits={exits}
            direction="west"
            handleMove={handleMove}
            lockedDirections={lockedDirections}
          />
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
          className="flex flex-col justify-center"
          style={{
            width: FRAME_WIDTH,
          }}
        >
          <MoveButton
            exits={exits}
            direction="east"
            handleMove={handleMove}
            lockedDirections={lockedDirections}
          />
        </div>
      </div>
      <div
        className="flex items-center justify-center"
        style={{
          height: FRAME_WIDTH,
        }}
      >
        <MoveButton
          exits={exits}
          direction="south"
          handleMove={handleMove}
          lockedDirections={lockedDirections}
        />
      </div>
    </div>
  );
}

const MoveButton = ({
  exits,
  handleMove,
  direction,
  lockedDirections = [],
}) => {
  const isLocked = lockedDirections.includes(direction);

  const rotateClasses = {
    north: "rotate-0",
    east: "rotate-90",
    south: "rotate-180",
    west: "-rotate-90",
  };
  const content = isLocked ? <span className="text-xs">🔒</span> : <>&#8593;</>;

  const rotateClass = isLocked ? "" : rotateClasses[direction];

  return (
    <div className="h-8 w-8 relative">
      <button
        onClick={() => {
          handleMove(direction);
        }}
        disabled={isLocked}
        className="h-full w-full flex items-center bg-gray-800 rounded-full justify-center"
        style={{
          visibility: exits[direction] === null ? "hidden" : "visible",
        }}
      >
        <div className="table-row">
          <div
            className={`table-cell align-middle text-center w-full h-full text-sm ${rotateClass}`}
          >
            {content}
          </div>
        </div>
      </button>
    </div>
  );
};

export default RoomFrame;
