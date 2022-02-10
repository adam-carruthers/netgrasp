import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  changeNodeGroupActivation,
  changeNodeGroupExclude,
  changeNodeGroupName,
  changeNodeGroupPosition,
  deleteNodeGroup,
  NodeGroup,
} from "../../redux/slices/nodeGroupsSlice";
import { startToggleNodesInNodeGroup } from "../../redux/slices/ongoingEditSlice";
import {
  setViewToFull,
  setViewToNodeGroup,
} from "../../redux/slices/viewSlice";
import DangerousButton from "../shared/DangerousButton";
import OngoingEditButton from "../shared/OngoingEditButton";

const NodeGroup: React.FC<{ nodeGroup: NodeGroup }> = ({ nodeGroup }) => {
  const dispatch = useAppDispatch();
  const thisNodeGroupIsBeingEdited = useAppSelector(
    ({ ongoingEdit }) =>
      ongoingEdit?.editType === "toggleNodesInNodeGroup" &&
      ongoingEdit.nodeGroupId === nodeGroup.id
  );
  const thisNodeGroupIsBeingViewedOnly = useAppSelector(
    ({ view }) =>
      view.viewStyle === "nodeGroup" && view.nodeGroupId === nodeGroup.id
  );

  return (
    <>
      <div
        className={
          "bg-light-grey py-1 px-1 me-2" +
          (nodeGroup.active ? " selected-tab-item" : "")
        }
        style={{ width: 450 }}
      >
        <input
          type="text"
          className="form-control py-0 mb-1"
          value={nodeGroup.name}
          onChange={(event) =>
            dispatch(
              changeNodeGroupName({
                nodeGroupId: nodeGroup.id,
                newName: event.target.value,
              })
            )
          }
        />
        <button
          type="button"
          className="btn btn-primary w-100 py-0 mb-1"
          onClick={() =>
            dispatch(
              changeNodeGroupActivation({
                nodeGroupId: nodeGroup.id,
                newActivation: !nodeGroup.active,
              })
            )
          }
        >
          {nodeGroup.active ? "Stop showing as circle" : "Show as circle"}
        </button>
        <div className="d-flex w-100">
          <div className="w-50 me-1">
            <button
              type="button"
              className="btn btn-success w-100 py-0 mb-1"
              onClick={() =>
                thisNodeGroupIsBeingViewedOnly
                  ? dispatch(setViewToFull())
                  : dispatch(setViewToNodeGroup(nodeGroup.id))
              }
            >
              {thisNodeGroupIsBeingViewedOnly
                ? "Set view back to full"
                : "View only node group"}
            </button>
            <DangerousButton
              beforeInitialClickMessage="Delete node group"
              onSecondClick={() => dispatch(deleteNodeGroup(nodeGroup.id))}
              className="btn btn-danger w-100 py-0 mb-1"
            />
          </div>
          <div className="w-50">
            <button
              type="button"
              className={
                "btn w-100 py-0 mb-1 btn-" +
                (nodeGroup.exclude ? "dark" : "light")
              }
              onClick={() =>
                dispatch(
                  changeNodeGroupExclude({
                    nodeGroupId: nodeGroup.id,
                    newExclude: !nodeGroup.exclude,
                  })
                )
              }
              style={{ border: "1px solid black" }}
            >
              {nodeGroup.exclude
                ? "Show nodes in group"
                : "Hide nodes in group"}
            </button>
            <OngoingEditButton
              isEditGoingSelector={() => thisNodeGroupIsBeingEdited}
              notGoingMessage="Toggle nodes in group"
              goingMessage="Click here to cancel"
              className="btn btn-warning w-100 py-0 mb-1"
              onStartEditClick={() =>
                dispatch(
                  startToggleNodesInNodeGroup({ nodeGroupId: nodeGroup.id })
                )
              }
            />
          </div>
        </div>
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-info flex-grow-1 py-0 me-1"
            onClick={() =>
              dispatch(
                changeNodeGroupPosition({
                  nodeGroupId: nodeGroup.id,
                  positionIndexChange: -1,
                })
              )
            }
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            className="btn btn-info flex-grow-1 py-0"
            onClick={() =>
              dispatch(
                changeNodeGroupPosition({
                  nodeGroupId: nodeGroup.id,
                  positionIndexChange: 1,
                })
              )
            }
          >
            &gt;&gt;
          </button>
        </div>
      </div>
      {thisNodeGroupIsBeingEdited && (
        <div className="me-2">
          <b>&lt;-- Being edited</b>
        </div>
      )}
    </>
  );
};

export default NodeGroup;
