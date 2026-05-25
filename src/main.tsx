import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp } from "antd";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
import "./index.css";

import { ThemeProvider } from "./providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AntApp>
          <App />
        </AntApp>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
