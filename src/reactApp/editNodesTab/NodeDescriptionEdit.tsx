import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createSelectHighlightedNodeProperty,
  selectHighlightedNodeId,
} from "../../redux/selectGraph/reselectView";
import { changeNodeDescription } from "../../redux/slices/fullGraphSlice";

const NodeDescriptionEdit = () => {
  const dispatch = useAppDispatch();
  const nodeId = useAppSelector(selectHighlightedNodeId) as string;
  const description = useAppSelector(
    createSelectHighlightedNodeProperty("description")
  ) as string;

  return (
    <div className="row">
      <div className="col-3">
        <label htmlFor="highlightDescriptionInput" className="form-label mb-0">
          Description
        </label>
      </div>
      <div className="col-9">
        <textarea
          className="form-control no-resize"
          id="highlightDescriptionInput"
          value={description || ""}
          rows={3}
          onChange={(event) => {
            dispatch(
              changeNodeDescription({
                nodeId,
                newDescription: event.target.value,
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default NodeDescriptionEdit;
