import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectHighlightedNodeId } from "../../redux/selectGraph/reselectView";

const LogicalGroupBox: React.FC<{
  node: { name: string; id: string } | undefined;
}> = ({ children, node }) => {
  const highlightedNodeId = useAppSelector(selectHighlightedNodeId);

  return (
    <div
      className={`bg-light-grey py-1 px-2 h-100 me-2${
        highlightedNodeId === node?.id ? " selected-tab-item" : ""
      }`}
      style={{ width: 200 }}
    >
      <div className="overflow-auto" style={{ whiteSpace: "nowrap" }}>
        {node ? node.name : "Error - Node not found"}
      </div>
      {children}
    </div>
  );
};

export default LogicalGroupBox;
