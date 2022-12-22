import React from "react";
import { CaptiveImage } from "../components/Captive";

export function Captives({
  freedCaptiveList,
  selectedCaptiveId,
  setSelectedCaptiveId,
}) {
  return (
    <>
      {freedCaptiveList.map((captive) => {
        const { colorClass } = captive;
        return (
          <button
            className="flex items-center justify-center h-6 w-6 relative mx-1 mt-2 mb-0 rounded-md bg-slate-800 p-1"
            key={captive.id}
            onClick={() =>
              setSelectedCaptiveId(
                captive.id === selectedCaptiveId ? null : captive.id
              )
            }
          >
            <div className={`${colorClass} w-full`}>
              <CaptiveImage captive={captive} color="currentColor" />
            </div>
          </button>
        );
      })}
    </>
  );
}
