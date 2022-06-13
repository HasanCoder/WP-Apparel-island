import React from "react";
import ReactDOM from "react-dom";

import Store from "./components/Store";
import App from "./components/App";

import "./tailwind/tailwind.output.css";

ReactDOM.render(
   <React.StrictMode>
      <Store>
         <App />
      </Store>
   </React.StrictMode>,
   document.getElementById("root")
);
