import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  changeNodeGroupActivation,
  changeNodeGroupName,
  changeNodeGroupPosition,
  deleteNodeGroup,
  NodeGroup,
} from "../../redux/slices/nodeGroupsSlice";
import { startToggleNodesInNodeGroup } from "../../redux/slices/ongoingEditSlice";
import DangerousButton from "../shared/DangerousButton";
import OngoingEditButton from "../shared/OngoingEditButton";

const NodeGroup: React.FC<{ nodeGroup: NodeGroup }> = ({ nodeGroup }) => {
  const dispatch = useAppDispatch();
  const thisNodeGroupIsBeingEdited = useAppSelector(
    ({ ongoingEdit }) =>
      ongoingEdit?.editType === "toggleNodesInNodeGroup" &&
      ongoingEdit.nodeGroupId === nodeGroup.id
  );

  return (
    <>
      <div
        className={
          "bg-light-grey py-1 px-1 me-2" +
          (nodeGroup.active ? " selected-tab-item" : "")
        }
        style={{ width: 250 }}
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
          {nodeGroup.active ? "Deactivate" : "Activate"}
        </button>
        <DangerousButton
          beforeInitialClickMessage="Delete node group"
          onSecondClick={() => dispatch(deleteNodeGroup(nodeGroup.id))}
          className="btn btn-danger w-100 py-0 mb-1"
        />
        <OngoingEditButton
          isEditGoingSelector={() => thisNodeGroupIsBeingEdited}
          notGoingMessage="Toggle nodes in group"
          goingMessage="Click here to cancel"
          className="btn btn-warning w-100 py-0 mb-1"
          onStartEditClick={() =>
            dispatch(startToggleNodesInNodeGroup({ nodeGroupId: nodeGroup.id }))
          }
        />
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
