import React, { useEffect } from "react";
import { ModalContext } from "../state/GameContext";

function Intro() {
  const { handleShowModal } = React.useContext(ModalContext);
  const ref = React.useRef();
  const introText = `While out exploring the winter woods, you find a warning pinned to a tree...
  
  "Protected research area. Important vivisection in progress. Do not enter. Enclosure patrolled by monsters."
  
  It is signed with an illegible signature.`;
  const [displayedText, setDisplayedText] = React.useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length === introText.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + introText[prev.length];
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      ref={ref}
      className="w-60 min-w-60 h-96 px-4 py-4 rounded-sm border whitespace-pre-line bg-black text-sm text-slate-200 border-slate-200 flex flex-col justify-between"
    >
      <div>{displayedText}</div>
      <button
        onClick={() => handleShowModal(false)}
        className="bg-slate-800 rounded-sm p-2"
      >
        I don't like this...
      </button>
    </div>
  );
}

export default Intro;
