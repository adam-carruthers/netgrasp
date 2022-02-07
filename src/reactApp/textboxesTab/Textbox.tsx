import React from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  changeTextboxText,
  changeTextboxVisibility,
  deleteTextbox,
  Textbox,
} from "../../redux/slices/textboxesSlice";
import DangerousButton from "../shared/DangerousButton";

const Textbox: React.FC<{ textbox: Textbox }> = ({ textbox }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="d-flex bg-light-grey p-1 me-2" style={{ width: 400 }}>
      <textarea
        className="form-control me-1 flex-shrink-1 flex-grow-1"
        style={{ resize: "none" }}
        value={textbox.text}
        onChange={(e) =>
          dispatch(
            changeTextboxText({
              textboxId: textbox.id,
              newText: e.target.value,
            })
          )
        }
      />
      <div className="flex-shrink-0 flex-grow-0" style={{ width: 180 }}>
        <DangerousButton
          beforeInitialClickMessage="Delete textbox"
          className="btn btn-danger py-0 w-100 mb-1"
          onSecondClick={() =>
            dispatch(deleteTextbox({ textboxId: textbox.id }))
          }
        />
        <button
          type="button"
          className={
            "btn py-0 w-100 btn-" + (textbox.visible ? "light" : "dark")
          }
          style={{ border: "1px solid black" }}
          onClick={() =>
            dispatch(
              changeTextboxVisibility({
                textboxId: textbox.id,
                newVisibility: !textbox.visible,
              })
            )
          }
        >
          {textbox.visible ? "Hide textbox" : "Show textbox"}
        </button>
      </div>
    </div>
  );
};

export default Textbox;
