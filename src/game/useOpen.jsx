import React from "react";

export function useOpen(initialState = false) {
  const [open, setOpen] = React.useState(initialState);

  const toggleOpen = () => {
    setOpen((o) => !o);
  };

  return { open, toggleOpen, setOpen };
}
