import React, { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectHighlightedNodeId } from "../../redux/selectGraph/reselectView";
import { ReduxNode } from "../../redux/slices/fullGraphSlice";
import { highlightNode } from "../../redux/slices/highlightedSlice";
import CenterViewOnHighlightedNodeContext from "../other/CenterViewOnHighlightedNodeContext";

const SearchedNode: React.FC<{
  node: ReduxNode;
  goToEditNodeTab: () => any;
}> = ({ node, goToEditNodeTab }) => {
  const nodeIsHighlightedNode = useAppSelector(
    (state) => selectHighlightedNodeId(state) === node.id
  );
  const centerViewOnHighlighted = useContext(
    CenterViewOnHighlightedNodeContext
  );
  const dispatch = useAppDispatch();

  return (
    <div
      className={
        "bg-light-grey p-1 me-2 d-flex flex-column" +
        (nodeIsHighlightedNode ? " selected-tab-item" : "")
      }
      style={{ width: 200 }}
    >
      <div
        className="overflow-auto flex-grow-0"
        style={{ whiteSpace: "nowrap" }}
      >
        {node.name}
      </div>
      {nodeIsHighlightedNode ? (
        <>
          <button
            type="button"
            className="btn btn-primary flex-grow-1 mb-1"
            onClick={goToEditNodeTab}
          >
            Go to edit nodes tab
          </button>
          <button
            type="button"
            className="btn btn-info flex-grow-1"
            onClick={centerViewOnHighlighted}
          >
            Center view on node
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn btn-primary flex-grow-1"
          onClick={() => dispatch(highlightNode(node.id))}
        >
          Highlight
        </button>
      )}
    </div>
  );
};

export default SearchedNode;
