import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addBlankNodeGroup } from "../../redux/slices/nodeGroupsSlice";
import NotFound from "../shared/NotFound";
import NodeGroup from "./NodeGroup";

const NodeGroupsTab = () => {
  const nodeGroups = useAppSelector((state) => state.nodeGroups);
  const dispatch = useAppDispatch();

  return (
    <div className="inner-tab">
      <button
        type="button"
        className="btn btn-success me-3"
        style={{ width: 120 }}
        onClick={() => dispatch(addBlankNodeGroup())}
      >
        Add new node group
      </button>
      {nodeGroups.length === 0 && (
        <div className="ms-2 h-100">
          <NotFound
            title="No node groups yet!"
            subtitle="Click the button on the left to add one."
          />
        </div>
      )}
      {nodeGroups.map((nodeGroup) => (
        <NodeGroup key={nodeGroup.id} nodeGroup={nodeGroup} />
      ))}
    </div>
  );
};

export default NodeGroupsTab;
