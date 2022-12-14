import React from "react";

function DialogueBox({
  children,
  onClick = () => {},
  isOpen,
  style = {},
  className = "",
}) {
  const ref = React.useRef(null);
  return (
    <div
      ref={ref}
      className={
        "px-2 py-1 sm:px-4 sm:py-2 bg-black flex flex-col items-center border-2 border-white border-double absolute rounded-md text-xs transition-opacity ease-in-out duration-500 " +
        className
      }
      style={{
        opacity: isOpen ? 1 : 0,
        bottom: "105%",
        pointerEvents: isOpen ? "all" : "none",
        minWidth: "200%",
        minHeight: "2.75rem",
        justifyContent: "center",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default DialogueBox;
