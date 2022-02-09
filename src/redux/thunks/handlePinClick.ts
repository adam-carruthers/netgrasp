import { NotificationManager } from "react-notifications";
import { SimulatedItem } from "../../d3App/common";
import { AppDispatch, RootState } from "../reduxStore";
import { fixNodeInPinGroup, PinGroup } from "../slices/pinGroupsSlice";

const handlePinClick = (
  ongoingEdit: RootState["ongoingEdit"],
  defaultPinGroup: PinGroup,
  clickedDataNode: SimulatedItem,
  dispatch: AppDispatch
) => {
  if (ongoingEdit) {
    NotificationManager.error(
      "You can't ctrl-click a node into the default pin group while an edit is ongoing.",
      "No ctrl-clicks during edits"
    );
    return;
  }
  if (!defaultPinGroup.active) {
    NotificationManager.error(
      "We don't allow you to ctrl-click add a node to the default pin group while the default pin group is deactivated.",
      "No ctrl-click if default pin group not active"
    );
    return;
  }
  if (clickedDataNode.pinSourceGroupId === defaultPinGroup.id) {
    NotificationManager.error(
      "Ctrl-click adds a node to the default pin group, so it is unclear what you want to do by clicking a node already in the default group.",
      "Node already in pin group"
    );
    return;
  }
  if (clickedDataNode.pinSourceGroupId) {
    NotificationManager.error(
      "The node is already in an active pin group (not the default), so you cannot ctrl-click to add it to the default group.",
      "Node already in pin group"
    );
    return;
  }
  dispatch(
    fixNodeInPinGroup({
      pinGroupId: defaultPinGroup.id,
      nodeId: clickedDataNode.id,
      fx: clickedDataNode.x,
      fy: clickedDataNode.y,
    })
  );
};

export default handlePinClick;
