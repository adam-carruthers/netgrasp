import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  ReduxNode,
  setNewParentOfExistingLogicalGroup,
} from "../../redux/slices/fullGraphSlice";
import { highlightNode } from "../../redux/slices/highlightedSlice";
import DangerousButton from "../shared/DangerousButton";
import LogicalGroupBox from "./LogicalGroupBox";

const LogicalGroupParent: React.FC<{
  nodeId: string;
  firstChildId: string;
}> = ({ nodeId, firstChildId }) => {
  const node = useAppSelector((state) =>
    state.fullGraph.nodes.find((graphNode) => graphNode.id === nodeId)
  ) as ReduxNode;

  const dispatch = useAppDispatch();

  return (
    <LogicalGroupBox node={node}>
      <DangerousButton
        beforeInitialClickMessage="Remove from group"
        onSecondClick={() =>
          dispatch(
            setNewParentOfExistingLogicalGroup({
              previousParentId: nodeId,
              newParentId: firstChildId,
              keepOldParentInGroup: false,
              clearOngoingEdit: false,
            })
          )
        }
        className="btn btn-danger w-100 py-0 mb-1"
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

export default LogicalGroupParent;
