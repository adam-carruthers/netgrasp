import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { haltOngoingEdit } from "../../redux/slices/ongoingEditSlice";
import { setCombineLogical } from "../../redux/slices/viewSlice";

const OngoingEditWatch = () => {
  const ongoingEdit = useAppSelector((state) => state.ongoingEdit);
  const combineLogical = useAppSelector((state) => state.view.combineLogical);
  const dispatch = useAppDispatch();

  if (ongoingEdit === null) return null;

  return (
    <div className="text-secondary">
      Ongoing edit: {ongoingEdit.editType}{" "}
      <button
        type="button"
        className="btn btn-warning btn-sm"
        onClick={() => dispatch(haltOngoingEdit())}
      >
        Cancel
      </button>
      {combineLogical && (
        <div>
          ⚠ Edits applied won&apos;t be applied to logical children{" "}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => dispatch(setCombineLogical(false))}
          >
            Turn off combine logical
          </button>
        </div>
      )}
    </div>
  );
};

export default OngoingEditWatch;
