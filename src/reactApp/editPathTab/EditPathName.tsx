import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createSelectSelectedPathProperty,
  selectSelectedPathId,
} from "../../redux/selectGraph/reselectView";
import { changePathName } from "../../redux/slices/pathsSlice";

const EditPathName = () => {
  const pathId = useAppSelector(selectSelectedPathId) as string;
  const name = useAppSelector(
    createSelectSelectedPathProperty("name")
  ) as string;
  const dispatch = useAppDispatch();

  return (
    <input
      type="text"
      className="form-control"
      value={name}
      onChange={(event) =>
        dispatch(
          changePathName({
            pathId,
            newName: event.target.value,
          })
        )
      }
    />
  );
};

export default EditPathName;
