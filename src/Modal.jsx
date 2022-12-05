import React from "react";

function Modal({ onClose, children }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={(e) => {
        onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "black",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button onClick={onClose}>x</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
