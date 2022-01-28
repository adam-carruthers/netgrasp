import React, { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectHighlightedNodeId } from "../../redux/selectGraph/reselectView";
import { ReduxNode } from "../../redux/slices/fullGraphSlice";
import { highlightNode } from "../../redux/slices/highlightedSlice";
import D3FunctionsContext from "../other/D3FunctionsContext";
import handleNodeClickThunk from "../../redux/thunks/handleNodeClickThunk";
import { SimulatedNode } from "../../d3App/common";

const SearchedNode: React.FC<{
  node: ReduxNode;
  goToEditNodeTab: () => any;
}> = ({ node, goToEditNodeTab }) => {
  useAppSelector((state) => state); // Refresh on any redux update
  const nodeIsHighlightedNode = useAppSelector(
    (state) => selectHighlightedNodeId(state) === node.id
  );
  const { centerViewOnHighlighted, getSimulatedNodeById } =
    useContext(D3FunctionsContext);
  const dispatch = useAppDispatch();

  const simNode = getSimulatedNodeById(node.id);

  return (
    <div
      className={
        "bg-light-grey p-1 me-2 d-flex flex-column" +
        (nodeIsHighlightedNode ? " selected-tab-item" : "")
      }
      style={{ width: 200 }}
    >
      <div
        className="overflow-auto flex-grow-0 flex-shrink-0"
        style={{ whiteSpace: "nowrap" }}
      >
        {node.name}
      </div>
      {nodeIsHighlightedNode ? (
        <>
          <button
            type="button"
            className="btn btn-warning flex-grow-1 mb-1"
            onClick={goToEditNodeTab}
          >
            Go to edit node tab
          </button>
          <button
            type="button"
            className="btn btn-info flex-grow-1 mb-1"
            onClick={centerViewOnHighlighted}
            disabled={!simNode}
          >
            {simNode ? "Center view on node" : "Node not in view"}
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn btn-info flex-grow-1 mb-1"
          onClick={() => dispatch(highlightNode(node.id))}
        >
          Highlight
        </button>
      )}
      <button
        type="button"
        className="btn btn-primary flex-grow-1"
        onClick={() => {
          if (simNode?.itemType === "node")
            dispatch(handleNodeClickThunk(simNode as SimulatedNode));
        }}
        disabled={!simNode}
      >
        {simNode ? "Click the node" : "Node not in view"}
      </button>
    </div>
  );
};

export default SearchedNode;
