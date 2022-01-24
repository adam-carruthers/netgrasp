import React from "react";
import icons from "../../icons/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createSelectHighlightedNodeProperty,
  selectHighlightedNodeId,
} from "../../redux/selectGraph/reselectView";
import { changeNodeIcon } from "../../redux/slices/fullGraphSlice";

const NodeIconEdit = () => {
  const dispatch = useAppDispatch();
  const nodeId = useAppSelector(selectHighlightedNodeId) as string;
  const nodeIcon = useAppSelector(
    createSelectHighlightedNodeProperty("icon")
  ) as string;

  return (
    <div className="d-flex h-100">
      <div className="flex-grow-0 me-3">
        <label className="form-label">Icon</label>
      </div>
      <div className="flex-grow-1 h-100">
        <div className="h-100 overflow-auto">
          {Object.entries(icons).map(([iconName, icon]) => (
            <div
              key={iconName}
              className={`w-100 p-2 mb-2 d-flex align-items-center cursor-pointer bg-${
                iconName === nodeIcon ? "info" : "light"
              }`}
              onClick={() => {
                dispatch(
                  changeNodeIcon({
                    nodeId,
                    newIcon: iconName as keyof typeof icons,
                  })
                );
              }}
            >
              <div>{iconName}</div>
              <div className="flex-grow-1" />
              <img src={icon} width={80} alt={iconName} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodeIconEdit;
