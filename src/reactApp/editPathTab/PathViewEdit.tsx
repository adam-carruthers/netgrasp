import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectSelectedPath } from "../../redux/selectGraph/reselectView";
import {
  setPathViewFull,
  setPathViewLimit,
} from "../../redux/slices/pathViewSlice";

const PathViewEdit = () => {
  const { showFull, limit } = useAppSelector((state) => state.pathView);
  const stepsLength = useAppSelector(
    (state) => selectSelectedPath(state)?.steps.length || 0
  );
  const finalNodeShortDescription = useAppSelector(
    (state) => selectSelectedPath(state)?.steps[limit - 1]?.shortDescription
  );
  const dispatch = useAppDispatch();

  return (
    <div className="me-3 bg-light-grey py-1 px-2 d-flex">
      <div className="me-3">
        <b>Path View</b>{" "}
        {!showFull && limit < stepsLength && "⚠ Not all path visible"}
        <br />
        Show full path:{" "}
        <input
          type="checkbox"
          checked={showFull}
          onChange={() => dispatch(setPathViewFull(!showFull))}
        />
        <br />
        <div className="d-flex align-items-baseline mb-1">
          <div className="flex-shrink-0 me-1">Show to:</div>
          <input
            type="number"
            value={limit}
            className="form-control text-center flex-grow-1"
            style={{ width: 100 }}
            onChange={(e) => {
              const targetValue = parseInt(e.target.value, 10);
              if (Number.isNaN(targetValue)) return;
              dispatch(setPathViewLimit(parseInt(e.target.value, 10)));
            }}
          />
        </div>
        <div className="d-flex w-100">
          <button
            type="button"
            className="btn btn-secondary me-1 px-1 flex-grow-1"
            onClick={() => dispatch(setPathViewLimit(1))}
            disabled={limit <= 1}
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            className="btn btn-primary me-1 px-2 flex-grow-1"
            onClick={() => dispatch(setPathViewLimit(limit - 1))}
            disabled={limit <= 1}
          >
            -1
          </button>
          <button
            type="button"
            className="btn btn-primary me-1 px-2 flex-grow-1"
            onClick={() => dispatch(setPathViewLimit(limit + 1))}
            disabled={limit >= stepsLength}
          >
            +1
          </button>
          <button
            type="button"
            className="btn btn-primary me-1 px-1 flex-grow-1"
            onClick={() => dispatch(setPathViewLimit(stepsLength))}
            disabled={limit >= stepsLength}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
      <div style={{ width: 180 }}>
        <b>Node {limit} description:</b>
        <br />
        {finalNodeShortDescription}
      </div>
    </div>
  );
};

export default PathViewEdit;
