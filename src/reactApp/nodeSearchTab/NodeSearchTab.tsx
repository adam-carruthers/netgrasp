import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectHighlightedNodeId,
  selectSearchedNodes,
} from "../../redux/selectGraph/reselectView";
import { startCreateLinkWithSource } from "../../redux/slices/ongoingEditSlice";
import OngoingEditButton from "../shared/OngoingEditButton";
import SearchedNode from "./SearchedNode";

const NodeSearchTab: React.FC<{ goToEditNodeTab: () => any }> = ({
  goToEditNodeTab,
}) => {
  const [searchString, setSearchString] = useState<string>("");
  const filteredNodes = useAppSelector((state) =>
    selectSearchedNodes(state, { searchString })
  );

  const dispatch = useAppDispatch();
  const highlightedNodeId = useAppSelector(selectHighlightedNodeId);

  return (
    <div className="inner-tab">
      <div className="me-4">
        <b>Search string:</b>
        <br />
        <input
          type="text"
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
          className="form-control mb-1"
        />
        <OngoingEditButton
          notGoingMessage="Create link from highlighted"
          goingMessage="Click to cancel"
          isEditGoingSelector={({ ongoingEdit }) =>
            ongoingEdit?.editType === "createLink"
          }
          onStartEditClick={() =>
            highlightedNodeId &&
            dispatch(startCreateLinkWithSource(highlightedNodeId))
          }
          className="btn btn-success w-100"
        />
      </div>
      {filteredNodes.map((node) => (
        <SearchedNode
          node={node}
          key={node.id}
          goToEditNodeTab={goToEditNodeTab}
        />
      ))}
    </div>
  );
};

export default NodeSearchTab;
