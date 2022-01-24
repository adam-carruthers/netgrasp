import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadGraph } from "./commonActions";
import { selectPath } from "./selectedPathSlice";

export interface PathView {
  showFull: boolean;
  limit: number;
}

const initialState: PathView = {
  showFull: true,
  limit: 1,
};

const pathViewSlice = createSlice({
  name: "pathView",

  initialState,

  reducers: {
    setPathViewFull: (state, action: PayloadAction<boolean>) => {
      // eslint-disable-next-line no-param-reassign
      state.showFull = action.payload;
    },

    setPathViewLimit: (state, action: PayloadAction<number>) => {
      // eslint-disable-next-line no-param-reassign
      state.limit = action.payload;
    },

    setPathViewToLimitedWithLimit: (state, action: PayloadAction<number>) => ({
      showFull: false,
      limit: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, () => initialState)
      .addCase(selectPath, () => initialState);
  },
});

export const {
  setPathViewFull,
  setPathViewLimit,
  setPathViewToLimitedWithLimit,
} = pathViewSlice.actions;

export default pathViewSlice.reducer;
