import { NotificationManager } from "react-notifications";
import { SimulatedNodeGroup } from "../../d3App/common";
import { AppThunk } from "../reduxStore";
import {
  fixNodeInPinGroup,
  removeNodeFromPinGroup,
} from "../slices/pinGroupsSlice";
import handlePinClick from "./handlePinClick";

const handleNodeGroupClickThunk =
  (clickedDataNode: SimulatedNodeGroup, event: MouseEvent): AppThunk =>
  (dispatch, getState) => {
    const {
      ongoingEdit,
      pinGroups: { default: defaultPinGroup },
    } = getState();

    if (event.ctrlKey) {
      handlePinClick(ongoingEdit, defaultPinGroup, clickedDataNode, dispatch);
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
    } else if (ongoingEdit) {
      NotificationManager.error(
        "You can't do this edit on a node group. Double click the node group to open it and perform the edit on the nodes inside.",
        "Edit doesn't apply to node group"
      );
    }
  };

export default handleNodeGroupClickThunk;
