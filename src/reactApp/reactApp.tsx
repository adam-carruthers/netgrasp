import React from "react";
import MainTabs from "./MainTabs";
import OngoingEditWatch from "./other/OngoingEditWatch";

const ReactApp = () => (
  <div className="container-fluid border-bottom" id="main-container">
    <h1>
      Network Diagram <OngoingEditWatch />
    </h1>
    <MainTabs />
  </div>
);

export default ReactApp;
