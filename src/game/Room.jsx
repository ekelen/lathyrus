import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { ROOM_SIZE } from "../data/setup";
import { useGame, useGameDispatch } from "../state/GameContext";
import { getRoomGradient } from "./color";
import InteractiveTooltip from "./components/InteractiveTooltip";
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
  const { movedCameraToOnTransition } = useGame();
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
    console.log(
      `[=] remounting room ${room.id} - isPreviousRoom: ${isPreviousRoom}`
    );
    if (roomRef.current && isPreviousRoom) {
      timer = setTimeout(() => {
        roomRef.current.style.left = `${
          END_POSITION_PREVIOUS[movedCameraToOnTransition].left ?? 0
        }`;
        roomRef.current.style.top = `${
          END_POSITION_PREVIOUS[movedCameraToOnTransition].top ?? 0
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

const MoveButton = ({ exits, handleMove, direction, lockedExits = [] }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ height: "2rem", width: "2rem", position: "relative" }}>
      <button
        onClick={() => {
          if (lockedExits.includes(direction)) {
            console.log(`[=] locked exit: ${direction}`);
            setOpen(true);
          } else {
            handleMove(direction);
          }
        }}
        disabled={exits[direction] === null}
        style={{
          height: "100%",
          width: "100%",
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

      <InteractiveTooltip
        onClick={() => setOpen(!open)}
        isOpen={open}
        style={{
          color: "red",
          height: "2rem",
          width: "2rem",
          top: 0,
          left: 0,
        }}
      >
        Locked!
      </InteractiveTooltip>
    </div>
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
        <MoveButton
          exits={exits}
          direction="north"
          handleMove={handleMove}
          lockedExits={lockedDirections}
        />
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
          <MoveButton
            exits={exits}
            direction="west"
            handleMove={handleMove}
            lockedExits={lockedDirections}
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
          style={{
            width: FRAME_WIDTH,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <MoveButton
            exits={exits}
            direction="east"
            handleMove={handleMove}
            lockedExits={lockedDirections}
          />
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
        <MoveButton
          exits={exits}
          direction="south"
          handleMove={handleMove}
          lockedExits={lockedDirections}
        />
      </div>
    </div>
  );
}

export default RoomFrame;
