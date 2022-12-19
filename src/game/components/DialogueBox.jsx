import _ from "lodash";
import React from "react";
import { BLACK } from "../color";

function DialogueBox({ children, onClick = () => {}, isOpen, style = {} }) {
  const ref = React.useRef(null);
  return (
    <div
      ref={ref}
      className="xs:px-2 xs:py-1 sm:px-4 sm:py-2 px-4 py-2"
      style={_.merge(
        {
          position: "absolute",
          transition: `opacity 1s ease 0s`,
          backgroundColor: `${BLACK}`,
          opacity: isOpen ? 1 : 0,
          bottom: "110%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0.5rem",
          pointerEvents: isOpen ? "all" : "none",
          color: "#f0f0f0",
          fontSize: "smaller",
          minWidth: "200%",
          border: "2px double #f0f0f0",
          minHeight: "2.75rem",
        },
        style
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default DialogueBox;
