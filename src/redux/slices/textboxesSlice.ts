import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { uploadGraph } from "./commonActions";

export interface Textbox {
  id: string;
  text: string;
  visible: boolean;
  x: number;
  y: number;
}

const getTextboxById = (state: Textbox[], textboxId: string) => {
  const textbox = state.find((textbox) => (textbox.id = textboxId));
  if (!textbox) {
    console.error("Couldn't find textbox", textboxId);
  }
  return textbox;
};

const textboxesSlice = createSlice({
  name: "textboxes",
  initialState: [] as Textbox[],
  reducers: {
    addBlankTextbox: (state) => {
      state.push({
        id: nanoid(),
        text: "Some text...",
        visible: true,
        x: 0,
        y: 0,
      });
    },

    changeTextboxText: (
      state,
      action: PayloadAction<{ textboxId: string; newText: string }>
    ) => {
      const textbox = getTextboxById(state, action.payload.textboxId);

      if (textbox) {
        textbox.text = action.payload.newText;
      }
    },

    changeTextboxVisibility: (
      state,
      action: PayloadAction<{ textboxId: string; newVisibility: boolean }>
    ) => {
      const textbox = getTextboxById(state, action.payload.textboxId);

      if (textbox) {
        textbox.visible = action.payload.newVisibility;
      }
    },

    changeTextboxPosition: (
      state,
      action: PayloadAction<{ textboxId: string; x: number; y: number }>
    ) => {
      const { textboxId, x, y } = action.payload;
      const textbox = getTextboxById(state, textboxId);

      if (textbox) {
        textbox.x = x;
        textbox.y = y;
      }
    },

    deleteTextbox: (state, action: PayloadAction<{ textboxId: string }>) =>
      state.filter((textbox) => textbox.id !== action.payload.textboxId),
  },
  extraReducers: (builder) => {
    builder.addCase(uploadGraph, () => []);
  },
});

export const {
  addBlankTextbox,
  changeTextboxText,
  changeTextboxVisibility,
  changeTextboxPosition,
  deleteTextbox,
} = textboxesSlice.actions;

export default textboxesSlice.reducer;
