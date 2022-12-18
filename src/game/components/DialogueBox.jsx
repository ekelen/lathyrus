import _ from "lodash";
import React from "react";
import { BLACK } from "../color";

function DialogueBox({ children, onClick = () => {}, isOpen, style = {} }) {
  const ref = React.useRef(null);
  return (
    <div
      ref={ref}
      style={_.merge(
        {
          position: "absolute",
          padding: "1rem",
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
