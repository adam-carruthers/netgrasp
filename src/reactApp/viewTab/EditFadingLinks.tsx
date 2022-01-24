import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setFadingLinks } from "../../redux/slices/viewSlice";

const EditFadingLinks = () => {
  const fadingLinks = useAppSelector((state) => state.view.fadingLinks);
  const dispatch = useAppDispatch();

  return (
    <div>
      Show fading links:{" "}
      <input
        type="checkbox"
        checked={fadingLinks}
        onChange={() => dispatch(setFadingLinks(!fadingLinks))}
      />
    </div>
  );
};

export default EditFadingLinks;
