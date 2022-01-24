import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { uploadGraph } from "./commonActions";
import { deleteNode } from "./fullGraphSlice";
import type { AppDispatch, RootState } from "../reduxStore";

export interface PathStep {
  id: string;
  nodeId: string;
  shortDescription: string;
}

export interface Path {
  id: string;
  name: string;
  steps: PathStep[];
}

export type PathAddPosition = "start" | "end" | number;

const getPathById = (state: Path[], pathId: string) => {
  const pathById = state.find((path) => path.id === pathId);
  if (!pathById) {
    // eslint-disable-next-line no-console
    console.error(`Tried to change path ${pathId} but it didn't exist.`);
  }
  return pathById;
};

const pathsSlice = createSlice({
  name: "paths",
  initialState: [] as Path[],
  reducers: {
    addPath: (state, action: PayloadAction<Path>) => {
      state.push(action.payload);
    },

    changePathName: (
      state,
      action: PayloadAction<{ pathId: string; newName: string }>
    ) => {
      const foundPath = getPathById(state, action.payload.pathId);
      if (foundPath) {
        foundPath.name = action.payload.newName;
      }
    },

    addNodeToPath: (
      state,
      action: PayloadAction<{
        pathId: string;
        addPosition: PathAddPosition;
        nodeId: string;
        clearOngoingEdit: boolean;
      }>
    ) => {
      const foundPath = getPathById(state, action.payload.pathId);
      if (foundPath) {
        const addPosition =
          action.payload.addPosition === "start"
            ? 0
            : action.payload.addPosition === "end"
            ? foundPath.steps.length
            : action.payload.addPosition;
        foundPath.steps.splice(addPosition, 0, {
          id: nanoid(),
          nodeId: action.payload.nodeId,
          shortDescription: "",
        });
      }
    },

    deleteStepFromPath: (
      state,
      action: PayloadAction<{ pathId: string; stepId: string }>
    ) => {
      const path = getPathById(state, action.payload.pathId);
      if (path) {
        path.steps = path.steps.filter(
          (step) => step.id !== action.payload.stepId
        );
      }
    },

    editPathStepShortDescription: (
      state,
      action: PayloadAction<{
        pathId: string;
        stepId: string;
        newShortDescription: string;
      }>
    ) => {
      const { pathId, stepId, newShortDescription } = action.payload;

      const step = state
        .find((path) => path.id === pathId)
        ?.steps.find((step) => step.id === stepId);
      if (step) {
        step.shortDescription = newShortDescription;
      } else {
        console.error("couldn't find path step");
      }
    },

    deletePath: (
      state,
      action: PayloadAction<{ pathId: string; isSelectedPath: boolean }>
    ) => state.filter((path) => path.id !== action.payload.pathId),
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        uploadGraph,
        (_, action) =>
          action.payload.paths?.map((path) => ({
            ...path,
            steps: path.steps.map((step) => ({
              ...step,
              shortDescription: step.shortDescription || "",
            })),
          })) || []
      )
      .addCase(deleteNode, (state, action) =>
        state.map((path) => ({
          ...path,
          steps: path.steps.filter((step) => step.nodeId !== action.payload),
        }))
      );
  },
});

export const {
  addPath,
  addNodeToPath,
  deleteStepFromPath,
  editPathStepShortDescription,
  changePathName,
  deletePath,
} = pathsSlice.actions;

export const deletePathThunk =
  (pathId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { selectedPath } = getState();
    dispatch(
      deletePath({
        pathId,
        isSelectedPath: selectedPath === pathId,
      })
    );
  };

export const addBlankPath = () => (dispatch: AppDispatch) =>
  dispatch(
    addPath({
      id: nanoid(),
      name: "New Path",
      steps: [],
    })
  );

export default pathsSlice.reducer;
