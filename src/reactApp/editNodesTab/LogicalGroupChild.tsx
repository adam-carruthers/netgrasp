import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  changeNodeLogicalParent,
  ReduxNode,
  setNewParentOfExistingLogicalGroup,
} from "../../redux/slices/fullGraphSlice";
import { highlightNode } from "../../redux/slices/highlightedSlice";
import DangerousButton from "../shared/DangerousButton";
import LogicalGroupBox from "./LogicalGroupBox";

const LogicalGroupChild: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const node = useAppSelector((state) =>
    state.fullGraph.nodes.find((graphNode) => graphNode.id === nodeId)
  ) as ReduxNode & { logicalParent: string };

  const dispatch = useAppDispatch();

  return (
    <LogicalGroupBox node={node}>
      <button
        type="button"
        className="btn btn-warning w-100 py-0 mb-1"
        onClick={() =>
          dispatch(
            setNewParentOfExistingLogicalGroup({
              previousParentId: node.logicalParent,
              newParentId: node.id,
              keepOldParentInGroup: true,
              clearOngoingEdit: true,
            })
          )
        }
      >
        Make the parent
      </button>
      <DangerousButton
        beforeInitialClickMessage="Remove from group"
        onSecondClick={() =>
          dispatch(
            changeNodeLogicalParent({
              nodeId,
              newParent: undefined,
              clearOngoingEdit: true,
            })
          )
        }
        className="btn btn-danger py-0 w-100 mb-1"
      />
      <button
        type="button"
        className="btn btn-primary w-100 py-0 mb-1"
        onClick={() => dispatch(highlightNode(node.id))}
      >
        Select node
      </button>
    </LogicalGroupBox>
  );
};

export default LogicalGroupChild;
