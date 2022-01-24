import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectSearchedNodes } from "../../redux/selectGraph/reselectView";
import SearchedNode from "./SearchedNode";

const NodeSearchTab: React.FC<{ goToEditNodeTab: () => any }> = ({
  goToEditNodeTab,
}) => {
  const [searchString, setSearchString] = useState<string>("");
  const filteredNodes = useAppSelector((state) =>
    selectSearchedNodes(state, { searchString })
  );

  return (
    <div className="inner-tab">
      <div className="me-4">
        <b>Search string:</b>
        <br />
        <input
          type="text"
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
          className="form-control"
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
