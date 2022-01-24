import type { AppThunk } from "../reduxStore";
import { setViewToFull, setViewToNodeFocus } from "../slices/viewSlice";

const handleNodeDblClickThunk =
  (clickedDataNode: { id: string }): AppThunk =>
  (dispatch, getState) => {
    const { view, ongoingEdit } = getState();

    if (ongoingEdit) {
      return;
    }

    if (view.viewStyle === "focus" && view.focusNodeId === clickedDataNode.id) {
      dispatch(setViewToFull());
    } else {
      dispatch(setViewToNodeFocus(clickedDataNode.id));
    }
  };

export default handleNodeDblClickThunk;
