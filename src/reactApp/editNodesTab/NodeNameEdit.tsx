import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createSelectHighlightedNodeProperty,
  selectHighlightedNodeId,
} from "../../redux/selectGraph/reselectView";
import { changeNodeName } from "../../redux/slices/fullGraphSlice";

const NodeNameEdit: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodeId = useAppSelector(selectHighlightedNodeId) as string;
  const nodeName = useAppSelector(
    createSelectHighlightedNodeProperty("name")
  ) as string;

  return (
    <div className="row align-items-center mb-1">
      <div className="col-3">
        <label htmlFor="highlightNameInput" className="form-label mb-0">
          Name
        </label>
      </div>
      <div className="col-9">
        <input
          type="text"
          className="form-control"
          id="highlightNameInput"
          value={nodeName}
          onChange={(event) => {
            dispatch(
              changeNodeName({
                nodeId,
                newName: event.target.value,
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default NodeNameEdit;
