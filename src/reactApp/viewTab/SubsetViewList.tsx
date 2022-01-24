import React from "react";
import { useAppSelector } from "../../redux/hooks";
import NotFound from "../shared/NotFound";
import SubsetViewEdit from "./SubsetViewEdit";

const SubsetViewList = () => {
  const subsetViews = useAppSelector((state) => state.subsetViews);

  return (
    <div className="d-flex view-tab-subset-container">
      {subsetViews.length === 0 && (
        <NotFound
          title="No subset views defined!"
          subtitle="Click the button on the left to add one"
        />
      )}
      {subsetViews.map((subsetView) => (
        <SubsetViewEdit key={subsetView.id} subsetView={subsetView} />
      ))}
    </div>
  );
};

export default SubsetViewList;
