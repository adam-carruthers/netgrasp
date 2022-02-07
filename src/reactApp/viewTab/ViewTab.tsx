import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { addBlankSubsetView } from "../../redux/slices/subsetViewsSlice";
import { setViewToFull } from "../../redux/slices/viewSlice";
import CurrentViewDisplay from "./CurrentViewDisplay";
import EditCombineLogical from "./EditCombineLogical";
import EditFadingLinks from "./EditFadingLinks";
import EditFocusViewDistance from "./EditFocusViewDistance";
import EditSubsetViewExplainer from "./EditSubsetViewExplainer";
import SubsetViewList from "./SubsetViewList";

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
      <div className="border-end me-3" />
      <button
        type="button"
        className="btn btn-success me-3"
        style={{ width: 100 }}
        onClick={() => dispatch(addBlankSubsetView())}
      >
        Add new subset view
      </button>
      <div className="me-2" style={{ maxWidth: 200 }}>
        <b>Subset views:</b>
        <br />
        <EditSubsetViewExplainer />
      </div>
      <SubsetViewList />
    </div>
  );
};

export default ViewTab;
