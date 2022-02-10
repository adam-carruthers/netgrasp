import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadGraph } from "./commonActions";
import { deleteNode } from "./fullGraphSlice";
import { deleteNodeGroup } from "./nodeGroupsSlice";
import { deletePath } from "./pathsSlice";
import { clearSelectedPath } from "./selectedPathSlice";

type View = (
  | { viewStyle: "full" }
  | { viewStyle: "focus"; focusNodeId: string }
  | { viewStyle: "nodeGroup"; nodeGroupId: string }
  | { viewStyle: "path" }
) & {
  fadingLinks: boolean;
  combineLogical: boolean;
  focusViewDistance: number;
};

const initialState: View = {
  viewStyle: "full",
  fadingLinks: true,
  combineLogical: false,
  focusViewDistance: 1,
};

const copyPersistentProperties = ({
  fadingLinks,
  combineLogical,
  focusViewDistance,
}: View) => ({
  fadingLinks,
  combineLogical,
  focusViewDistance,
});

const viewSlice = createSlice({
  name: "view",
  initialState: initialState as View,
  reducers: {
    setViewToFull: (state) => ({
      viewStyle: "full",
      ...copyPersistentProperties(state),
    }),

    setViewToNodeFocus: (state, action: PayloadAction<string>) => ({
      viewStyle: "focus",
      focusNodeId: action.payload,
      ...copyPersistentProperties(state),
    }),

    setViewToNodeGroup: (state, action: PayloadAction<string>) => ({
      viewStyle: "nodeGroup",
      nodeGroupId: action.payload,
      ...copyPersistentProperties(state),
    }),

    setViewToPathView: (state) => ({
      viewStyle: "path",
      ...copyPersistentProperties(state),
    }),

    setFadingLinks: (state, action: PayloadAction<boolean>) => {
      // eslint-disable-next-line no-param-reassign
      state.fadingLinks = action.payload;
    },

    setCombineLogical: (state, action: PayloadAction<boolean>) => {
      // eslint-disable-next-line no-param-reassign
      state.combineLogical = action.payload;
    },

    setFocusViewDistance: (state, action: PayloadAction<number>) => {
      state.focusViewDistance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, () => initialState)
      .addCase(deleteNode, (state, action) =>
        state.viewStyle === "focus" && state.focusNodeId === action.payload
          ? {
              viewStyle: "full",
              ...copyPersistentProperties(state),
            }
          : state
      )
      .addCase(clearSelectedPath, (state) =>
        state.viewStyle === "path"
          ? {
              viewStyle: "full",
              ...copyPersistentProperties(state),
            }
          : state
      )
      .addCase(deleteNodeGroup, (state, action) =>
        state.viewStyle === "nodeGroup" && state.nodeGroupId === action.payload
          ? {
              viewStyle: "full",
              ...copyPersistentProperties(state),
            }
          : state
      )
      .addCase(deletePath, (state, action) =>
        state.viewStyle === "path" && action.payload.isSelectedPath
          ? {
              viewStyle: "full",
              ...copyPersistentProperties(state),
            }
          : state
      );
  },
});

export const {
  setViewToFull,
  setViewToNodeFocus,
  setViewToNodeGroup,
  setViewToPathView,
  setFadingLinks,
  setFocusViewDistance,
  setCombineLogical,
} = viewSlice.actions;

export default viewSlice.reducer;
