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
        "xs:px-2 xs:py-1 sm:px-4 sm:py-2 px-4 py-2 bg-black flex flex-col items-center justify-center border-2 border-white border-double absolute rounded-md text-xs transition-opacity ease-in-out duration-500 " +
        className
      }
      style={{
        opacity: isOpen ? 1 : 0,
        bottom: "105%",
        pointerEvents: isOpen ? "all" : "none",
        minWidth: "200%",
        minHeight: "2.75rem",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default DialogueBox;
