import React from "react";
import MainTabs from "./MainTabs";
import OngoingEditWatch from "./other/OngoingEditWatch";
import logo from "./other/netgrasp_logo_with_name.png";

const ReactApp = () => (
  <div className="container-fluid border-bottom" id="main-container">
    <div className="d-flex align-items-center">
      <img src={logo} height={80} className="me-4" />
      <OngoingEditWatch />
    </div>
    <MainTabs />
  </div>
);

export default ReactApp;
