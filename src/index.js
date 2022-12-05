import _ from "lodash";
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
    console.log("Accepting the updated printMe module!");

    printMe();
  });
}
