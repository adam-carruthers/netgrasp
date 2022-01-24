import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCombineLogical } from "../../redux/slices/viewSlice";

const EditCombineLogical = () => {
  const combineLogical = useAppSelector((state) => state.view.combineLogical);
  const dispatch = useAppDispatch();

  return (
    <div>
      Combine logical devices:{" "}
      <input
        type="checkbox"
        checked={combineLogical}
        onChange={() => dispatch(setCombineLogical(!combineLogical))}
      />
    </div>
  );
};

export default EditCombineLogical;
