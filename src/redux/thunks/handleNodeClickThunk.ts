import { NotificationManager } from "react-notifications";
import type { SimulatedNode } from "../../d3App/common";
import type { AppThunk } from "../reduxStore";
import { selectLogicalChildrenOfNode } from "../selectGraph/reselectView";
import {
  changeNodeLogicalParent,
  createLinkAndClearOngoingEdit,
  setNewParentOfExistingLogicalGroup,
} from "../slices/fullGraphSlice";
import { highlightNode } from "../slices/highlightedSlice";
import {
  addNodeToNodeGroup,
  removeNodeFromNodeGroup,
} from "../slices/nodeGroupsSlice";
import { haltOngoingEdit } from "../slices/ongoingEditSlice";
import { addNodeToPath } from "../slices/pathsSlice";
import {
  fixNodeInPinGroup,
  removeNodeFromPinGroup,
} from "../slices/pinGroupsSlice";
import {
  addNodeToSubsetView,
  removeNodeFromSubsetView,
} from "../slices/subsetViewsSlice";
import handlePinClick from "./handlePinClick";

const handleNodeClickThunk =
  (clickedDataNode: SimulatedNode, event?: MouseEvent): AppThunk =>
  (dispatch, getState) => {
    const {
      ongoingEdit,
      fullGraph: { nodes },
      pinGroups: { default: defaultPinGroup },
    } = getState();

    if (event && event.ctrlKey) {
      handlePinClick(ongoingEdit, defaultPinGroup, clickedDataNode, dispatch);
    } else if (ongoingEdit?.editType === "createLink" && ongoingEdit.source) {
      dispatch(
        createLinkAndClearOngoingEdit({
          source: ongoingEdit.source,
          target: clickedDataNode.id,
        })
      );
    } else if (ongoingEdit?.editType === "editSubsetView") {
      if (clickedDataNode.ongoingEditIsTransparent) {
        dispatch(
          addNodeToSubsetView({
            subsetViewId: ongoingEdit.subsetViewId,
            newNodeId: clickedDataNode.id,
          })
        );
      } else {
        dispatch(
          removeNodeFromSubsetView({
            subsetViewId: ongoingEdit.subsetViewId,
            deleteNodeId: clickedDataNode.id,
          })
        );
      }
    } else if (ongoingEdit?.editType === "addToPath") {
      dispatch(
        addNodeToPath({
          pathId: ongoingEdit.pathId,
          addPosition: ongoingEdit.addPosition,
          nodeId: clickedDataNode.id,
          clearOngoingEdit: ongoingEdit.cancelEditOnAdd,
        })
      );
    } else if (
      ongoingEdit?.editType === "addNodeToLogicalGroup" &&
      ongoingEdit.otherNodeId === clickedDataNode.id
    ) {
      NotificationManager.error(
        "You cannot add a node to a logical group with itself",
        "Cannot add node to logical group"
      );
    } else if (
      ongoingEdit?.editType === "addNodeToLogicalGroup" &&
      ongoingEdit.otherNodeWillBe === "parent"
    ) {
      if (
        clickedDataNode.logicalParent ||
        selectLogicalChildrenOfNode(clickedDataNode.id, nodes).length
      ) {
        dispatch(
          setNewParentOfExistingLogicalGroup({
            previousParentId:
              clickedDataNode.logicalParent || clickedDataNode.id,
            newParentId: ongoingEdit.otherNodeId,
            keepOldParentInGroup: true,
            clearOngoingEdit: true,
          })
        );
        NotificationManager.warning(
          "We made the highlighted node the new parent of that whole group.",
          "The node you just clicked was already in a logical group"
        );
        // TODO - Handle that case
        return;
      }
      dispatch(
        changeNodeLogicalParent({
          nodeId: clickedDataNode.id,
          newParent: ongoingEdit.otherNodeId,
          clearOngoingEdit: true,
        })
      );
    } else if (
      ongoingEdit?.editType === "addNodeToLogicalGroup" &&
      ongoingEdit.otherNodeWillBe === "child"
    ) {
      if (selectLogicalChildrenOfNode(ongoingEdit.otherNodeId, nodes).length) {
        NotificationManager.error(
          "The node you wanted to be a child is somehow already a parent itself, which is not allowed. " +
            "To resolve this, go to the node you wanted to be the child and make sure it is not a parent.",
          "Could not add node as child"
        );
        dispatch(haltOngoingEdit());
        return;
      }
      dispatch(
        changeNodeLogicalParent({
          nodeId: ongoingEdit.otherNodeId,
          newParent: clickedDataNode.logicalParent || clickedDataNode.id,
          clearOngoingEdit: true,
        })
      );
    } else if (ongoingEdit?.editType === "toggleNodesInLogicalGroup") {
      if (clickedDataNode.id === ongoingEdit.parentNodeId) {
        dispatch(
          setNewParentOfExistingLogicalGroup({
            previousParentId: clickedDataNode.id,
            newParentId: clickedDataNode.logicalChildren[0],
            keepOldParentInGroup: false,
            // If the parent node has no children, there are no nodes left
            // So clear the ongoing edit
            clearOngoingEdit: !clickedDataNode.logicalChildren.length,
          })
        );
        return;
      }
      if (
        clickedDataNode.logicalChildren.length ||
        (clickedDataNode.logicalParent &&
          clickedDataNode.logicalParent !== ongoingEdit.parentNodeId)
      ) {
        NotificationManager.error(
          "Can't toggle nodes into a logical group that are already in another logical group. To add the node you clicked to the group you have selected please first delete the node from the logical group it is already in.",
          "That node is already the member of another logical group",
          10000
        );
        return;
      }
      if (clickedDataNode.logicalParent === ongoingEdit.parentNodeId) {
        dispatch(
          changeNodeLogicalParent({
            nodeId: clickedDataNode.id,
            newParent: undefined,
            clearOngoingEdit: false,
          })
        );
        return;
      }
      if (clickedDataNode.logicalParent === undefined) {
        dispatch(
          changeNodeLogicalParent({
            nodeId: clickedDataNode.id,
            newParent: ongoingEdit.parentNodeId,
            clearOngoingEdit: false,
          })
        );
        return;
      }
      console.error("This code should never be reached.");
    } else if (ongoingEdit?.editType === "toggleNodesInPinGroup") {
      if (clickedDataNode.ongoingEditIsTransparent) {
        dispatch(
          fixNodeInPinGroup({
            pinGroupId: ongoingEdit.pinGroupId,
            nodeId: clickedDataNode.id,
            fx: clickedDataNode.x,
            fy: clickedDataNode.y,
          })
        );
      } else {
        dispatch(
          removeNodeFromPinGroup({
            pinGroupId: ongoingEdit.pinGroupId,
            nodeId: clickedDataNode.id,
          })
        );
      }
    } else if (ongoingEdit?.editType === "toggleNodesInNodeGroup") {
      if (clickedDataNode.ongoingEditIsTransparent) {
        dispatch(
          addNodeToNodeGroup({
            nodeGroupId: ongoingEdit.nodeGroupId,
            nodeId: clickedDataNode.id,
          })
        );
      } else {
        dispatch(
          removeNodeFromNodeGroup({
            nodeGroupId: ongoingEdit.nodeGroupId,
            nodeId: clickedDataNode.id,
          })
        );
      }
    } else {
      dispatch(highlightNode(clickedDataNode.id));
    }
  };

export default handleNodeClickThunk;
