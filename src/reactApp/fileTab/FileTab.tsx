import React from "react";
import { NotificationManager } from "react-notifications";
import store from "../../redux/reduxStore";
import { uploadGraph } from "../../redux/slices/commonActions";
import DangerousButton from "../shared/DangerousButton";
import { readFile, saveFile } from "./fileOperations";

const FileTab = () => (
  <div className="inner-tab">
    <div className="me-2">
      <button
        type="button"
        className="btn btn-success h-100"
        onClick={async () => {
          const state = store.getState();
          await saveFile(
            JSON.stringify({
              ...state.fullGraph,
              subsetViews: state.subsetViews,
              paths: state.paths,
              pinGroups: state.pinGroups,
            })
          );
          NotificationManager.success(
            "Your file saved successfully.",
            "File Saved!"
          );
        }}
      >
        Save a copy
      </button>
    </div>
    <div className="me-2">
      <button
        type="button"
        className="btn btn-warning h-100"
        onClick={async () => {
          const newData = JSON.parse(await readFile());
          store.dispatch(uploadGraph(newData));
        }}
      >
        Open
      </button>
    </div>
    <div className="me-2">
      <DangerousButton
        beforeInitialClickMessage="Clear graph"
        afterInitialClickMessage="Are you sure? (This deletes everything)"
        className="btn btn-danger h-100"
        style={{ maxWidth: 180 }}
        onSecondClick={() =>
          store.dispatch(uploadGraph({ nodes: [], links: [] }))
        }
      />
    </div>
  </div>
);

export default FileTab;
