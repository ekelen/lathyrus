import React from "react";
import Svg from "../components/Svg";
import Key from "../img/key.svg";

export function Keys({
  captivesByRoomId,
  haveKeysTo,
  currentRoomId,
  dispatch,
}) {
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
              className={`btn usable h-6 w-6 relative mx-1 mt-2 mb-0 p-1 disabled:bg-transparent`}
              key={`${i}-${key}`}
              disabled={currentRoomId !== captive.id || captive.freed}
              onClick={() => handleFreeCaptive({ keyTo: captive.id })}
            >
              <div
                className={`relative w-full h-full flex items-center justify-center ${colorClass}`}
              >
                <Svg source={Key} height="70%" width="100%" />
              </div>
            </button>
          );
        })}
    </>
  );
}
