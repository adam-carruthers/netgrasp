import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectHighlightedNodeLogicalGroup } from "../../redux/selectGraph/reselectView";
import { clearLogicalGroup } from "../../redux/slices/fullGraphSlice";
import { startToggleNodesInLogicalGroup } from "../../redux/slices/ongoingEditSlice";
import DangerousButton from "../shared/DangerousButton";
import OngoingEditButton from "../shared/OngoingEditButton";
import LogicalGroupChild from "./LogicalGroupChild";
import LogicalGroupParent from "./LogicalGroupParent";

const LogicalGroupDisplay = () => {
  const logicalGroup = useAppSelector(selectHighlightedNodeLogicalGroup) as {
    parent: string;
    children: string[];
  };
  const dispatch = useAppDispatch();

  return (
    <>
      <OngoingEditButton
        isEditGoingSelector={({ ongoingEdit }) =>
          ongoingEdit?.editType === "toggleNodesInLogicalGroup"
        }
        notGoingMessage="Toggle (add and take away) nodes from logical group"
        goingMessage="Click nodes to toggle them in the logical group, click here to cancel"
        onStartEditClick={() =>
          dispatch(
            startToggleNodesInLogicalGroup({
              parentNodeId: logicalGroup.parent,
            })
          )
        }
        className="btn btn-warning me-1"
        style={{ width: 150 }}
      />
      <DangerousButton
        beforeInitialClickMessage="Clear the logical group"
        className="btn btn-danger me-3"
        style={{ width: 100 }}
        onSecondClick={() =>
          dispatch(clearLogicalGroup({ parentNodeId: logicalGroup.parent }))
        }
      />
      <div className="me-1">
        <b>
          Logical
          <br />
          group
          <br />
          parent:
        </b>
      </div>
      <div className="me-1">
        <LogicalGroupParent
          nodeId={logicalGroup.parent}
          firstChildId={logicalGroup.children[0]}
        />
      </div>
      <div className="me-1">
        <b>
          Logical
          <br />
          group
          <br />
          children:
        </b>
      </div>
      <div className="d-flex me-3">
        {logicalGroup.children.map((childNodeId) => (
          <LogicalGroupChild key={childNodeId} nodeId={childNodeId} />
        ))}
      </div>
    </>
  );
};

export default LogicalGroupDisplay;
