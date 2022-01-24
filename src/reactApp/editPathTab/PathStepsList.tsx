import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createSelectSelectedPathProperty,
  selectSelectedPathId,
} from "../../redux/selectGraph/reselectView";
import { startAddToPath } from "../../redux/slices/ongoingEditSlice";
import type { PathStep as PathStepType } from "../../redux/slices/pathsSlice";
import OngoingEditButton from "../shared/OngoingEditButton";
import PathStep from "./PathStep";

const PathStepsList = () => {
  const pathId = useAppSelector(selectSelectedPathId) as string;
  const pathSteps = useAppSelector(
    createSelectSelectedPathProperty("steps")
  ) as PathStepType[];
  const dispatch = useAppDispatch();

  return (
    <div
      className="d-flex edit-path-tab-steps-container"
      style={{ width: 200 }}
    >
      {pathSteps.length === 0 && (
        <div className="d-flex flex-column">
          <div className="flex-grow-1" />
          <h3 className="mb-1">No steps defined!</h3>
          <span className="text-secondary">
            Click &quot;Add to path start&quot; on the left to start building
            the path.
          </span>
          <div className="flex-grow-1" />
        </div>
      )}
      {pathSteps.map((step, i) => (
        <React.Fragment key={step.id}>
          <PathStep step={step} iStep={i} />
          <OngoingEditButton
            isEditGoingSelector={({ ongoingEdit }) =>
              ongoingEdit?.editType === "addToPath" &&
              ongoingEdit.addPosition === i + 1
            }
            notGoingMessage="Insert node into path here"
            goingMessage="Click node to add, click here to cancel"
            className="btn btn-success h-100 me-1"
            style={{ width: 100 }}
            onStartEditClick={() =>
              dispatch(
                startAddToPath({
                  addPosition: i + 1,
                  pathId,
                  cancelEditOnAdd: true,
                })
              )
            }
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default PathStepsList;
