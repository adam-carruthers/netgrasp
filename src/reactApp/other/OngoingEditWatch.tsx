import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { haltOngoingEdit } from "../../redux/slices/ongoingEditSlice";

const OngoingEditWatch = () => {
  const ongoingEdit = useAppSelector((state) => state.ongoingEdit);
  const combineLogical = useAppSelector((state) => state.view.combineLogical);
  const dispatch = useAppDispatch();

  if (ongoingEdit === null) return null;

  return (
    <small className="text-secondary" style={{ fontSize: "0.5em" }}>
      Ongoing edit: {ongoingEdit.editType}{" "}
      <button
        type="button"
        className="btn btn-warning btn-sm"
        onClick={() => dispatch(haltOngoingEdit())}
      >
        Cancel
      </button>
      {combineLogical &&
        " ⚠ Edits applied won't be applied to logical children"}
    </small>
  );
};

export default OngoingEditWatch;
