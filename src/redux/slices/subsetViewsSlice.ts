import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { uploadGraph } from "./commonActions";
import { deleteNode } from "./fullGraphSlice";

export interface SubsetView {
  id: string;
  name: string;
  nodes: string[];
}

const getSubsetViewById = (state: SubsetView[], subsetViewId: string) => {
  const pathById = state.find((subView) => subView.id === subsetViewId);
  if (!pathById) {
    // eslint-disable-next-line no-console
    console.error(
      `Tried to change subset view ${subsetViewId} but it didn't exist.`
    );
  }
  return pathById;
};

const subsetViewsSlice = createSlice({
  name: "subsetViews",
  initialState: [] as SubsetView[],
  reducers: {
    addSubsetView: (state, action: PayloadAction<SubsetView>) => {
      state.push(action.payload);
    },

    addBlankSubsetView: (state) => {
      state.push({
        id: nanoid(),
        name: "New Subset View",
        nodes: [],
      });
    },

    editSubsetViewName: (
      state,
      action: PayloadAction<{ subsetViewId: string; newName: string }>
    ) => {
      const foundSubsetView = getSubsetViewById(
        state,
        action.payload.subsetViewId
      );
      if (foundSubsetView) {
        foundSubsetView.name = action.payload.newName;
      }
    },

    deleteSubsetView: (state, action: PayloadAction<string>) =>
      state.filter((subsetView) => subsetView.id !== action.payload),

    addNodeToSubsetView: (
      state,
      action: PayloadAction<{ subsetViewId: string; newNodeId: string }>
    ) => {
      const foundSubsetView = getSubsetViewById(
        state,
        action.payload.subsetViewId
      );
      if (foundSubsetView) {
        foundSubsetView.nodes.push(action.payload.newNodeId);
      }
    },

    removeNodeFromSubsetView: (state, action) => {
      const foundSubsetView = getSubsetViewById(
        state,
        action.payload.subsetViewId
      );
      if (foundSubsetView) {
        foundSubsetView.nodes = foundSubsetView.nodes.filter(
          (nodeId) => nodeId !== action.payload.deleteNodeId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, (_, action) => action.payload.subsetViews || [])
      .addCase(deleteNode, (state, action) =>
        state.map((subsetView) => ({
          ...subsetView,
          nodes: subsetView.nodes.filter((nodeId) => nodeId !== action.payload),
        }))
      );
  },
});

export const {
  addSubsetView,
  editSubsetViewName,
  deleteSubsetView,
  addNodeToSubsetView,
  removeNodeFromSubsetView,
  addBlankSubsetView,
} = subsetViewsSlice.actions;

export default subsetViewsSlice.reducer;
