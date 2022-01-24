import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addBlankPath } from "../../redux/slices/pathsSlice";
import { clearSelectedPath } from "../../redux/slices/selectedPathSlice";
import PathItem from "./PathItem";

const PathsTab: React.FC<{ goToEditPathsTab: () => void }> = ({
  goToEditPathsTab,
}) => {
  const paths = useAppSelector((state) => state.paths);
  const dispatch = useAppDispatch();

  return (
    <div className="inner-tab">
      <div className="me-2">
        <button
          type="button"
          className="btn btn-success h-100"
          onClick={() => dispatch(addBlankPath())}
        >
          Add path
        </button>
      </div>
      <div className="me-4" style={{ width: 90 }}>
        <button
          type="button"
          className="btn btn-primary h-100"
          onClick={() => dispatch(clearSelectedPath())}
        >
          Deselect selected path
        </button>
      </div>
      <div className="me-2">
        <b>Paths:</b>
      </div>
      <div className="d-flex paths-tab-paths-container">
        {paths.length === 0 && (
          <div className="d-flex flex-column">
            <div className="flex-grow-1" />
            <h3 className="mb-1">No paths created!</h3>
            <span className="text-secondary">
              Click on the button to the left to add one.
            </span>
            <div className="flex-grow-1" />
          </div>
        )}
        {paths.map((path) => (
          <PathItem
            key={path.id}
            path={path}
            goToEditPathsTab={goToEditPathsTab}
          />
        ))}
      </div>
    </div>
  );
};

export default PathsTab;
