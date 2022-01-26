import { SimulatedLink } from "../../d3App/common";
import type { AppThunk } from "../reduxStore";
import { deleteLinkAndClearOngoingEdit } from "../slices/fullGraphSlice";

const handleLinkClickThunk =
  (dataLink: SimulatedLink): AppThunk =>
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
