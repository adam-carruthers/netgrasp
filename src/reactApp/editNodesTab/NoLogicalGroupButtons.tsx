import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectHighlightedNodeId } from "../../redux/selectGraph/reselectView";
import { startAddNodeToLogicalGroup } from "../../redux/slices/ongoingEditSlice";
import OngoingEditButton from "../shared/OngoingEditButton";

const NoLogicalGroupButtons = () => {
  const nodeId = useAppSelector(selectHighlightedNodeId) as string;
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="me-2">
        <OngoingEditButton
          isEditGoingSelector={({ ongoingEdit }) =>
            ongoingEdit?.editType === "addNodeToLogicalGroup" &&
            ongoingEdit.otherNodeId === nodeId &&
            ongoingEdit.otherNodeWillBe === "child"
          }
          notGoingMessage="Add this node to a logical group with this node as CHILD. Child nodes disappear when logical devices are combined."
          goingMessage="Click a node and this node will join the clicked node's logical group as a child"
          onStartEditClick={() =>
            dispatch(
              startAddNodeToLogicalGroup({
                otherNodeId: nodeId,
                otherNodeWillBe: "child",
              })
            )
          }
          className="btn btn-info h-100"
          style={{ width: 250 }}
        />
      </div>
      <div className="me-2">
        <OngoingEditButton
          isEditGoingSelector={({ ongoingEdit }) =>
            ongoingEdit?.editType === "addNodeToLogicalGroup" &&
            ongoingEdit.otherNodeId === nodeId &&
            ongoingEdit.otherNodeWillBe === "parent"
          }
          notGoingMessage="Add this node to a logical group with this node as PARENT. The parent node shows when logical devices are combined."
          goingMessage="Click a node and this node will join the clicked node's logical group as a parent"
          onStartEditClick={() =>
            dispatch(
              startAddNodeToLogicalGroup({
                otherNodeId: nodeId,
                otherNodeWillBe: "parent",
              })
            )
          }
          className="btn btn-info h-100"
          style={{ width: 260 }}
        />
      </div>
    </>
  );
};

export default NoLogicalGroupButtons;
