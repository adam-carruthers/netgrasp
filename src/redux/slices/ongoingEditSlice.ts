import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadGraph } from "./commonActions";
import {
  changeNodeLogicalParent,
  clearLogicalGroup,
  createLinkAndClearOngoingEdit,
  deleteLinkAndClearOngoingEdit,
  deleteNode,
  setNewParentOfExistingLogicalGroup,
} from "./fullGraphSlice";
import {
  addNodeToPath,
  deletePath,
  deleteStepFromPath,
  PathAddPosition,
} from "./pathsSlice";
import { deletePinGroup } from "./pinGroupsSlice";
import { selectPath } from "./selectedPathSlice";

interface AddToPathEditOptions {
  addPosition: PathAddPosition;
  pathId: string;
  cancelEditOnAdd: boolean;
}

interface AddNodeToLogicalGroupOptions {
  otherNodeId: string;
  otherNodeWillBe: "parent" | "child";
}

type OngoingEdit =
  | null
  | { editType: "createLink"; source: string }
  | { editType: "deleteLink" }
  | { editType: "editSubsetView"; subsetViewId: string }
  | ({ editType: "addToPath" } & AddToPathEditOptions)
  | ({ editType: "addNodeToLogicalGroup" } & AddNodeToLogicalGroupOptions)
  | {
      editType: "toggleNodesInLogicalGroup";
      parentNodeId: string;
    }
  | { editType: "toggleNodesInPinGroup"; pinGroupId: string };

const ongoingEditSlice = createSlice({
  name: "ongoingEdit",
  initialState: null as OngoingEdit,
  reducers: {
    startCreateLinkWithSource: (_, action: PayloadAction<string>) => ({
      editType: "createLink",
      source: action.payload,
    }),

    startDeleteLink: () => ({ editType: "deleteLink" } as const),

    startEditSubsetView: (_, action: PayloadAction<string>) => ({
      editType: "editSubsetView",
      subsetViewId: action.payload,
    }),

    startAddToPath: (_, action: PayloadAction<AddToPathEditOptions>) => ({
      editType: "addToPath",
      addPosition: action.payload.addPosition,
      pathId: action.payload.pathId,
      cancelEditOnAdd: action.payload.cancelEditOnAdd,
    }),

    startAddNodeToLogicalGroup: (
      _,
      action: PayloadAction<AddNodeToLogicalGroupOptions>
    ) => ({
      editType: "addNodeToLogicalGroup",
      otherNodeId: action.payload.otherNodeId,
      otherNodeWillBe: action.payload.otherNodeWillBe,
    }),

    startToggleNodesInLogicalGroup: (
      _,
      action: PayloadAction<{ parentNodeId: string }>
    ) => ({
      editType: "toggleNodesInLogicalGroup",
      parentNodeId: action.payload.parentNodeId,
    }),

    startToggleNodesInPinGroup: (
      _,
      action: PayloadAction<{ pinGroupId: string }>
    ) => ({
      editType: "toggleNodesInPinGroup",
      pinGroupId: action.payload.pinGroupId,
    }),

    haltOngoingEdit: () => null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, () => null)
      .addCase(deleteNode, () => null)
      .addCase(deleteLinkAndClearOngoingEdit, () => null)
      .addCase(createLinkAndClearOngoingEdit, () => null)
      .addCase(selectPath, () => null)
      .addCase(addNodeToPath, (state, action) =>
        action.payload.clearOngoingEdit ? null : state
      )
      .addCase(deletePath, () => null)
      .addCase(deleteStepFromPath, () => null)
      .addCase(changeNodeLogicalParent, (state, action) =>
        action.payload.clearOngoingEdit ? null : state
      )
      .addCase(setNewParentOfExistingLogicalGroup, (state, action) =>
        action.payload.clearOngoingEdit
          ? null
          : state?.editType === "toggleNodesInLogicalGroup" &&
            state.parentNodeId === action.payload.previousParentId &&
            !action.payload.keepOldParentInGroup
          ? { ...state, parentNodeId: action.payload.newParentId }
          : state
      )
      .addCase(clearLogicalGroup, () => null)
      .addCase(deletePinGroup, () => null);
  },
});

export const {
  startCreateLinkWithSource,
  startDeleteLink,
  startEditSubsetView,
  startAddToPath,
  startAddNodeToLogicalGroup,
  startToggleNodesInLogicalGroup,
  startToggleNodesInPinGroup,
  haltOngoingEdit,
} = ongoingEditSlice.actions;

export default ongoingEditSlice.reducer;
