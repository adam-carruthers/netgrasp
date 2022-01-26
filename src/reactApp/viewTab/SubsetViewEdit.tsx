import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { startEditSubsetView } from "../../redux/slices/ongoingEditSlice";
import {
  deleteSubsetView,
  editSubsetViewExclude,
  editSubsetViewName,
  SubsetView,
} from "../../redux/slices/subsetViewsSlice";
import { setViewToSubsetView } from "../../redux/slices/viewSlice";
import OngoingEditButton from "../shared/OngoingEditButton";

const SubsetViewEdit: React.FC<{ subsetView: SubsetView }> = ({
  subsetView,
}) => {
  const isBeingViewed = useAppSelector(
    ({ view }) =>
      view.viewStyle === "subset" && view.subsetViewId === subsetView.id
  );

  const dispatch = useAppDispatch();

  return (
    <div className={isBeingViewed ? "selected-tab-item" : undefined}>
      <input
        type="text"
        className="form-control mb-1"
        value={subsetView.name}
        onChange={(event) =>
          dispatch(
            editSubsetViewName({
              subsetViewId: subsetView.id,
              newName: event.target.value,
            })
          )
        }
      />
      <button
        type="button"
        className="btn btn-primary flex-grow-1 mb-1 py-0"
        onClick={() => dispatch(setViewToSubsetView(subsetView.id))}
      >
        {isBeingViewed ? "Currently viewing" : "View"}
      </button>
      {subsetView.exclude ? (
        <button
          type="button"
          className="btn btn-dark flex-grow-1 mb-1 py-0"
          onClick={() =>
            dispatch(
              editSubsetViewExclude({
                subsetViewId: subsetView.id,
                newExclude: false,
              })
            )
          }
        >
          Stop excluding
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-light flex-grow-1 mb-1 py-0"
          style={{ border: "solid 1px black" }}
          onClick={() =>
            dispatch(
              editSubsetViewExclude({
                subsetViewId: subsetView.id,
                newExclude: true,
              })
            )
          }
        >
          Exclude
        </button>
      )}
      <div className="d-flex flex-grow-1">
        <div className="w-50 pe-1 h-100">
          <OngoingEditButton
            isEditGoingSelector={({ ongoingEdit }) =>
              !!(
                ongoingEdit &&
                ongoingEdit.editType === "editSubsetView" &&
                ongoingEdit.subsetViewId === subsetView.id
              )
            }
            className="btn btn-warning w-100 h-100 py-0"
            notGoingMessage="Edit"
            goingMessage="Stop Editing"
            onStartEditClick={() =>
              dispatch(startEditSubsetView(subsetView.id))
            }
          />
        </div>
        <div className="w-50 h-100">
          <button
            type="button"
            className="btn btn-danger w-100 h-100 py-0"
            onClick={() => dispatch(deleteSubsetView(subsetView.id))}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubsetViewEdit;
