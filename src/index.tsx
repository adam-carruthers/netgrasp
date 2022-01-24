import React from "react";
import ReactDOM from "react-dom";

import "./reactApp/reactNotifications/notifs.css";
import { NotificationContainer } from "react-notifications";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "./redux/reduxStore";

import ErrorBoundary from "./reactApp/other/ErrorBoundary";

import d3AppInit from "./d3App/d3App";
import ReactApp from "./reactApp/reactApp";
import CenterViewOnHighlightedNodeContext from "./reactApp/other/CenterViewOnHighlightedNodeContext";

const persistor = persistStore(store);

const { boundCenterViewOnHighlightedNode } = d3AppInit();

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <CenterViewOnHighlightedNodeContext.Provider
        value={boundCenterViewOnHighlightedNode}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ReactApp />
          </PersistGate>
        </Provider>
        <NotificationContainer />
      </CenterViewOnHighlightedNodeContext.Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("app")
);
