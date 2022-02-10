import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { setViewToFull } from "../../redux/slices/viewSlice";
import CurrentViewDisplay from "./CurrentViewDisplay";
import EditCombineLogical from "./EditCombineLogical";
import EditFadingLinks from "./EditFadingLinks";
import EditFocusViewDistance from "./EditFocusViewDistance";

const ViewTab = () => {
  const view = useAppSelector((state) => state.view);
  const dispatch = useDispatch();

  if (view.fadingLinks === undefined) {
    // eslint-disable-next-line no-console
    console.error("The fading links have become undefined");
  }

  return (
    <div className="inner-tab">
      <button
        type="button"
        className="btn btn-primary me-2"
        style={{ width: 90 }}
        onClick={() => dispatch(setViewToFull())}
      >
        Set view full
      </button>
      <div className="me-3">
        <CurrentViewDisplay />
        <EditFadingLinks />
        <EditCombineLogical />
        <EditFocusViewDistance />
      </div>
    </div>
  );
};

export default ViewTab;
