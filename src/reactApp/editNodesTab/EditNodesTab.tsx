import React from "react";
import { useDispatch } from "react-redux";
import { addNewDefaultNode } from "../../redux/slices/fullGraphSlice";
import { startDeleteLink } from "../../redux/slices/ongoingEditSlice";
import OngoingEditButton from "../shared/OngoingEditButton";
import EditHighlightedNodeSubtab from "./EditHighlightedNodeSubtab";

const EditNodesTab = () => {
  const dispatch = useDispatch();

  return (
    <div className="inner-tab">
      <div className="me-2">
        <button
          type="button"
          className="btn btn-success h-100"
          style={{ width: 95 }}
          onClick={() => dispatch(addNewDefaultNode())}
        >
          Add new node
        </button>
      </div>
      <div className="me-2">
        <OngoingEditButton
          isEditGoingSelector={({ ongoingEdit }) =>
            ongoingEdit?.editType === "deleteLink"
          }
          notGoingMessage="Start delete link edit"
          goingMessage="Click link ot delete, click here to cancel"
          onStartEditClick={() => dispatch(startDeleteLink())}
          className="btn btn-danger h-100"
          style={{ width: 105 }}
        />
      </div>
      <EditHighlightedNodeSubtab />
    </div>
  );
};

export default EditNodesTab;
