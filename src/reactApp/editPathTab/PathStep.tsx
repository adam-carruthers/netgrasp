import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { selectSelectedPathId } from "../../redux/selectGraph/reselectView";
import {
  editPathStepShortDescription,
  PathStep as PathStepType,
} from "../../redux/slices/pathsSlice";
import { deleteStepFromPath } from "../../redux/slices/pathsSlice";
import { setPathViewToLimitedWithLimit } from "../../redux/slices/pathViewSlice";
import DangerousButton from "../shared/DangerousButton";

const PathStep: React.FC<{
  step: PathStepType;
  iStep: number;
}> = ({ step, iStep }) => {
  const pathId = useAppSelector(selectSelectedPathId) as string;
  const node = useAppSelector((state) =>
    state.fullGraph.nodes.find((graphNode) => graphNode.id === step.nodeId)
  );
  const dispatch = useDispatch();

  return (
    <div className="d-flex flex-column" style={{ width: 250 }}>
      <div className="overflow-auto" style={{ whiteSpace: "nowrap" }}>
        {node ? node.name : "Error - Node not found"}
      </div>
      <button
        type="button"
        className="btn btn-primary mb-1 py-0"
        onClick={() => dispatch(setPathViewToLimitedWithLimit(iStep + 1))}
      >
        Show path to this point
      </button>
      <DangerousButton
        beforeInitialClickMessage="Delete from path"
        className="btn btn-danger py-0 mb-1"
        onSecondClick={() =>
          dispatch(deleteStepFromPath({ pathId, stepId: step.id }))
        }
      />
      <input
        className="form-control"
        style={{ minWidth: "auto" }}
        placeholder="Step Description"
        value={step.shortDescription}
        onChange={(event) =>
          dispatch(
            editPathStepShortDescription({
              pathId,
              stepId: step.id,
              newShortDescription: event.target.value,
            })
          )
        }
      />
    </div>
  );
};

export default PathStep;
