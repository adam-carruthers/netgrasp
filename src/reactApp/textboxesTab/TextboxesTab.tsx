import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addBlankTextbox } from "../../redux/slices/textboxesSlice";
import NotFound from "../shared/NotFound";
import Textbox from "./Textbox";

const TextboxesTab = () => {
  const dispatch = useAppDispatch();

  const textboxes = useAppSelector((state) => state.textboxes);

  return (
    <div className="inner-tab">
      <button
        type="button"
        className="btn btn-success me-3"
        style={{ width: 120 }}
        onClick={() => dispatch(addBlankTextbox())}
      >
        Add new textbox
      </button>
      <div className="me-2">
        <b>Textboxes:</b>
      </div>
      {textboxes.length === 0 && (
        <NotFound
          title="No textboxes created yet"
          subtitle="Create one using the button on the left"
        />
      )}
      {textboxes.map((textbox) => (
        <Textbox key={textbox.id} textbox={textbox} />
      ))}
    </div>
  );
};

export default TextboxesTab;
