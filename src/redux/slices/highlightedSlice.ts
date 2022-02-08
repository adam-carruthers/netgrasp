import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadGraph } from "./commonActions";
import { deleteNode } from "./fullGraphSlice";

type Highlighted = { hNode: string } | null;

const highlightedSlice = createSlice({
  name: "highlighted",
  initialState: null as Highlighted,
  reducers: {
    highlightNode: (_, action: PayloadAction<string>) => ({
      hNode: action.payload,
    }),
    clearHighlightedNode: () => null,
  },
  extraReducers: (builder) => {
    builder.addCase(uploadGraph, () => null);
    // unhighlight the current node if the current node is deleted
    builder.addCase(deleteNode, (state, action) =>
      state?.hNode === action.payload ? null : state
    );
  },
});

export const { highlightNode, clearHighlightedNode } = highlightedSlice.actions;

export default highlightedSlice.reducer;
