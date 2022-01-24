import type { AppThunk } from "../reduxStore";
import {
  deleteLinkAndClearOngoingEdit,
  ReduxNode,
} from "../slices/fullGraphSlice";

interface D3InternalLink {
  source: ReduxNode;
  target: ReduxNode;
}

const handleLinkClickThunk =
  (dataLink: D3InternalLink): AppThunk =>
  (dispatch, getState) => {
    const { ongoingEdit } = getState();

    if (ongoingEdit?.editType === "deleteLink") {
      dispatch(
        deleteLinkAndClearOngoingEdit({
          source: dataLink.source.id,
          target: dataLink.target.id,
        })
      );
    }
  };

export default handleLinkClickThunk;
