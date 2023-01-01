// Bibliotecas de terceiros
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// Bibliotecas da aplicação
import { store as reduxStore } from "./store";
import { AppRouting } from "./routing.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={reduxStore}>
    <AppRouting />
  </Provider>
);
