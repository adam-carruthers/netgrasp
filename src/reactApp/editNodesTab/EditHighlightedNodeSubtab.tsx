import React from "react";
import {
  addNewDefaultNode,
  deleteNode,
} from "../../redux/slices/fullGraphSlice";
import { startCreateLinkWithSource } from "../../redux/slices/ongoingEditSlice";
import NotFound from "../shared/NotFound";

import NodeNameEdit from "./NodeNameEdit";
import NodeDescriptionEdit from "./NodeDescriptionEdit";
import NodeIconEdit from "./NodeIconEdit";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectHighlightedNode,
  selectHighlightedNodeId,
} from "../../redux/selectGraph/reselectView";
import OngoingEditButton from "../shared/OngoingEditButton";
import DangerousButton from "../shared/DangerousButton";
import LogicalCombineSubtab from "./LogicalCombineSubtab";

const EditHighlightedNodeSubtab = () => {
  const nodeId = useAppSelector(selectHighlightedNodeId);
  const isNodeHighlighted = useAppSelector(
    (state) => selectHighlightedNode(state) !== null
  );
  const dispatch = useAppDispatch();

  if (!nodeId || !isNodeHighlighted) {
    return (
      <NotFound
        title="No Node Highlighted!"
        subtitle="Click on a node in the main area to highlight it."
      />
    );
  }

  return (
    <>
      <div className="me-5" style={{ width: 400 }}>
        <NodeNameEdit />
        <NodeDescriptionEdit />
      </div>
      <div className="me-5" style={{ width: 240 }}>
        <NodeIconEdit />
      </div>
      <div className="me-2">
        <button
          type="button"
          className="btn btn-success h-100"
          style={{ width: 150 }}
          onClick={() => {
            dispatch(addNewDefaultNode([nodeId]));
          }}
        >
          Add new node connected to this node
        </button>
      </div>
      <div className="me-2">
        <DangerousButton
          beforeInitialClickMessage="Delete node"
          afterInitialClickMessage="Are you sure?"
          className="btn btn-danger h-100"
          style={{ width: 100 }}
          onSecondClick={() => {
            dispatch(deleteNode(nodeId));
          }}
        />
      </div>
      <div className="me-4">
        <OngoingEditButton
          isEditGoingSelector={({ ongoingEdit }) =>
            !!(ongoingEdit && ongoingEdit.editType === "createLink")
          }
          notGoingMessage="Add new link from this node"
          goingMessage="Click another node to add a link, click here to cancel this edit"
          onStartEditClick={() => dispatch(startCreateLinkWithSource(nodeId))}
          className="btn btn-primary h-100"
          style={{ width: 150 }}
        />
      </div>
      <LogicalCombineSubtab />
    </>
  );
};

export default EditHighlightedNodeSubtab;
