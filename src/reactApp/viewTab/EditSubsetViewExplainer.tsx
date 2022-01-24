import React from "react";
import { useAppSelector } from "../../redux/hooks";

const EditSubsetViewExplainer: React.FC = () => {
  const subsetViewEditIsOngoing = useAppSelector(
    ({ ongoingEdit }) => ongoingEdit?.editType === "editSubsetView"
  );

  if (!subsetViewEditIsOngoing) return null;

  return (
    <>
      Click nodes to toggle them into or out of the subset view. Transparent
      implies not in the subset view.
    </>
  );
};

export default EditSubsetViewExplainer;
