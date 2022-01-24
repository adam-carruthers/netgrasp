import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  changePathName,
  deletePathThunk,
  Path,
} from "../../redux/slices/pathsSlice";
import { selectPath } from "../../redux/slices/selectedPathSlice";
import DangerousButton from "../shared/DangerousButton";

const PathItem: React.FC<{
  path: Path;
  goToEditPathsTab: () => void;
}> = ({ path, goToEditPathsTab }) => {
  const dispatch = useAppDispatch();
  const thisPathSelected = useAppSelector(
    (state) => state.selectedPath === path.id
  );

  return (
    <div className={thisPathSelected ? "selected-tab-item" : undefined}>
      <input
        type="text"
        className="form-control mb-1"
        value={path.name}
        onChange={(event) =>
          dispatch(
            changePathName({
              pathId: path.id,
              newName: event.target.value,
            })
          )
        }
      />
      <button
        type="button"
        className="btn btn-primary w-100 flex-grow-1 mb-1"
        onClick={() =>
          thisPathSelected ? goToEditPathsTab() : dispatch(selectPath(path.id))
        }
      >
        {thisPathSelected ? "Click for edit paths tab" : "Select"}
      </button>
      <DangerousButton
        beforeInitialClickMessage="Delete path"
        className="btn btn-danger w-100 flex-grow-1"
        onSecondClick={() => dispatch(deletePathThunk(path.id))}
      />
    </div>
  );
};

export default PathItem;
