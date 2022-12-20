import React from "react";

function Modal({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center h-screen w-screen"
      onClick={(e) => {
        onClose();
      }}
    >
      <div
        className="relative p-4 flex flex-col items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
