import "./style.css";
import printMe from "./print.js";

import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("app");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

if (module.hot) {
  module.hot.accept("./print.js", function () {
    console.log("Just a hot module test thing!");

    printMe();
  });
}
