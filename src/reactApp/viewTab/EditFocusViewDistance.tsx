import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setFocusViewDistance } from "../../redux/slices/viewSlice";

const EditFocusViewDistance = () => {
  const focusViewDistance = useAppSelector(
    (state) => state.view.focusViewDistance
  );
  const dispatch = useAppDispatch();

  return (
    <div className="d-flex align-items-baseline">
      Focus view distance:
      <button
        type="button"
        className="btn btn-info py-0 px-1 ms-2"
        disabled={focusViewDistance <= 1}
        onClick={() => dispatch(setFocusViewDistance(focusViewDistance - 1))}
      >
        -
      </button>
      <b className="mx-2">{focusViewDistance}</b>
      <button
        type="button"
        className="btn btn-info py-0 px-1"
        onClick={() => dispatch(setFocusViewDistance(focusViewDistance + 1))}
      >
        +
      </button>
    </div>
  );
};

export default EditFocusViewDistance;
