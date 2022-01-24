import React from "react";
import { useAppSelector } from "../../redux/hooks";

const CurrentViewDisplay = () => {
  const viewStyle = useAppSelector((state) => state.view.viewStyle);

  return <div>Current view: {viewStyle}</div>;
};

export default CurrentViewDisplay;
