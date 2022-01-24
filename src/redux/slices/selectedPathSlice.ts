import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadGraph } from "./commonActions";
import { deletePath } from "./pathsSlice";

type SelectedPath = string | null;

const selectedPathSlice = createSlice({
  name: "selectedPath",
  initialState: null as SelectedPath,
  reducers: {
    selectPath: (_, action: PayloadAction<string>) => action.payload,

    clearSelectedPath: () => null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, () => null)
      .addCase(deletePath, (state, action) =>
        action.payload.pathId === state ? null : state
      );
  },
});

export const { selectPath, clearSelectedPath } = selectedPathSlice.actions;

export default selectedPathSlice.reducer;
