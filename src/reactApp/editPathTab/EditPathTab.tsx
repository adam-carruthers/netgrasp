import React from "react";
import { useDispatch } from "react-redux";
import { startAddToPath } from "../../redux/slices/ongoingEditSlice";
import { deletePathThunk } from "../../redux/slices/pathsSlice";
import { setViewToPathView } from "../../redux/slices/viewSlice";
import { useAppSelector } from "../../redux/hooks";
import NotFound from "../shared/NotFound";
import {
  selectSelectedPath,
  selectSelectedPathId,
} from "../../redux/selectGraph/reselectView";
import EditPathName from "./EditPathName";
import OngoingEditButton from "../shared/OngoingEditButton";
import DangerousButton from "../shared/DangerousButton";
import PathStepsList from "./PathStepsList";
import PathViewEdit from "./PathViewEdit";

const EditPathTab = () => {
  const pathId = useAppSelector(selectSelectedPathId);
  const isPathSelected = useAppSelector(
    (state) => selectSelectedPath(state) !== null
  );
  const dispatch = useDispatch();

  if (!pathId || !isPathSelected) {
    return (
      <div className="inner-tab">
        <NotFound
          title="No path selected!"
          subtitle={'Go to the "All paths" tab and select a path to continue'}
        />
      </div>
    );
  }

  return (
    <div className="inner-tab">
      <PathViewEdit />
      <div className="me-4" style={{ width: 500 }}>
        <div className="row gx-1 gy-1">
          <div className="col-12">
            <EditPathName />
          </div>
          <div className="col-6">
            <OngoingEditButton
              isEditGoingSelector={({ ongoingEdit }) =>
                ongoingEdit?.editType === "addToPath" &&
                ongoingEdit.addPosition === "start"
              }
              notGoingMessage="Edit - Add to path start"
              goingMessage="Click on nodes to add to path start, click here to stop editing"
              className="btn btn-secondary w-100 h-100"
              onStartEditClick={() =>
                dispatch(
                  startAddToPath({
                    addPosition: "start",
                    pathId,
                    cancelEditOnAdd: false,
                  })
                )
              }
            />
          </div>
          <div className="col-6">
            <OngoingEditButton
              isEditGoingSelector={({ ongoingEdit }) =>
                ongoingEdit?.editType === "addToPath" &&
                ongoingEdit.addPosition === "end"
              }
              notGoingMessage="Edit - Add to path end"
              goingMessage="Click on nodes to add to path start, click here to stop editing"
              className="btn btn-warning w-100 h-100"
              onStartEditClick={() =>
                dispatch(
                  startAddToPath({
                    addPosition: "end",
                    pathId,
                    cancelEditOnAdd: false,
                  })
                )
              }
            />
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => dispatch(setViewToPathView())}
            >
              Set view to path only
            </button>
          </div>
          <div className="col-6">
            <DangerousButton
              beforeInitialClickMessage="Delete path"
              afterInitialClickMessage="Are you sure?"
              onSecondClick={() => dispatch(deletePathThunk(pathId))}
              className="btn btn-danger w-100"
            />
          </div>
        </div>
      </div>
      <div className="me-2">
        <b>Path steps:</b>
      </div>
      <PathStepsList />
    </div>
  );
};

export default EditPathTab;
