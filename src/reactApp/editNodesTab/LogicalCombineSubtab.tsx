import React from "react";
import { useAppSelector } from "../../redux/hooks";
import {
  createSelectHighlightedNodeProperty,
  selectHighlightedNodeLogicalChildren,
} from "../../redux/selectGraph/reselectView";
import EditCombineLogical from "../viewTab/EditCombineLogical";
import LogicalGroupDisplay from "./LogicalGroupDisplay";
import NoLogicalGroupButtons from "./NoLogicalGroupButtons";

const LogicalCombineSubtab = () => {
  const parent = useAppSelector(
    createSelectHighlightedNodeProperty("logicalParent")
  ) as string | undefined;
  const hasChildren = useAppSelector(
    (state) => selectHighlightedNodeLogicalChildren(state).length > 0
  );

  return (
    <>
      <div className="bg-light-grey py-1 px-2 me-3" style={{ maxWidth: 370 }}>
        <b>Logical Combine Section</b>
        <br />
        <i>
          The &quot;parent&quot; device means the primary device and the only
          device that will show in combined view.
        </i>
        <EditCombineLogical />
        {parent && hasChildren && (
          <div>
            ⚠ This node has parents and children at the same time which is a
            bug, please fix.
          </div>
        )}
        {parent || hasChildren ? (
          // eslint-disable-next-line react/jsx-one-expression-per-line
          <div>
            &gt; This node <b>is</b> in a logical group
          </div>
        ) : (
          // eslint-disable-next-line react/jsx-one-expression-per-line
          <div>
            &gt; This node <b>is not</b> in a logical group
          </div>
        )}
      </div>
      {parent || hasChildren ? (
        <LogicalGroupDisplay />
      ) : (
        <NoLogicalGroupButtons />
      )}
    </>
  );
};

export default LogicalCombineSubtab;
