import _ from "lodash";
import "./style.css";
import Pine00 from "./pine00.png";
import printMe from "./print.js";

import React from "react";
import * as ReactDOM from "react-dom/client";

const title = "React with Webpack and Babel";

const rootElement = document.getElementById("app");
const root = ReactDOM.createRoot(rootElement);
root.render(<div>{title}</div>);

// function component() {
//   const element = document.createElement("div");
//   const btn = document.createElement("button");
//   element.innerHTML = _.join(["Hello", "webpack"], " ");

//   const myIcon = new Image();

//   myIcon.src = Pine00;

//   btn.innerHTML = "Click me and check the console!";

//   btn.onclick = printMe;

//   element.appendChild(btn);

//   element.appendChild(myIcon);

//   return element;
// }

// document.body.appendChild(component());

// if (module.hot) {
//   module.hot.accept("./print.js", function () {
//     console.log("Accepting the updated printMe module!");

//     printMe();
//   });
// }
