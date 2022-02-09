import React from "react";
import ReactDOM from "react-dom";
import SeriousErrorNotice from "./reactApp/other/SeriousErrorNotice";

const showEverythingHasBrokenError = () => {
  ReactDOM.render(
    <React.StrictMode>
      <SeriousErrorNotice />
    </React.StrictMode>,
    document.getElementById("app")
  );
};

export default showEverythingHasBrokenError;
