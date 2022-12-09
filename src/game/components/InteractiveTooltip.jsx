import _ from "lodash";
import { triangle } from "polished";
import React from "react";

function InteractiveTooltip({
  children,
  onClick = () => {},
  isOpen,
  style = {},
}) {
  const ref = React.useRef(null);
  return (
    <div
      ref={ref}
      style={_.merge(
        {
          position: "absolute",
          padding: "1rem",
          transition: `opacity 1s ease 0s`,
          backgroundColor: "rgba(255,255,255,0.5)",
          opacity: isOpen ? 1 : 0,
          top: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0.5rem",
          pointerEvents: isOpen ? "all" : "none",
          color: "black",
        },
        style
      )}
      onClick={onClick}
    >
      <div
        style={{
          ...triangle({
            pointingDirection: "top",
            width: "10px",
            height: "10px",
            foregroundColor: "rgba(255,255,255,0.5)",
          }),
          position: "absolute",
          top: "-10px",
        }}
      ></div>
      {children}
    </div>
  );
}

export default InteractiveTooltip;
