import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { uploadGraph } from "./commonActions";
import { deleteNode } from "./fullGraphSlice";

export interface NodeGroup {
  id: string;
  name: string;
  active: boolean;
  members: string[];
}

const getNodeGroupById = (state: NodeGroup[], nodeGroupId: string) => {
  const nodeGroup = state.find((nodeGroup) => nodeGroup.id === nodeGroupId);
  if (!nodeGroup) {
    console.error("Couldn't find node group", nodeGroupId);
  }
  return nodeGroup;
};

const nodeGroupsSlice = createSlice({
  name: "nodeGroups",
  initialState: [] as NodeGroup[],
  reducers: {
    addBlankNodeGroup: (state) => {
      state.push({
        id: nanoid(),
        name: "New Node Group",
        active: false,
        members: [],
      });
    },

    changeNodeGroupName: (
      state,
      action: PayloadAction<{ nodeGroupId: string; newName: string }>
    ) => {
      const nodeGroup = getNodeGroupById(state, action.payload.nodeGroupId);

      if (nodeGroup) {
        nodeGroup.name = action.payload.newName;
      }
    },

    changeNodeGroupActivation: (
      state,
      action: PayloadAction<{ nodeGroupId: string; newActivation: boolean }>
    ) => {
      const nodeGroup = getNodeGroupById(state, action.payload.nodeGroupId);

      if (nodeGroup) {
        nodeGroup.active = action.payload.newActivation;
      }
    },

    addNodeToNodeGroup: (
      state,
      action: PayloadAction<{ nodeGroupId: string; nodeId: string }>
    ) => {
      const nodeGroup = getNodeGroupById(state, action.payload.nodeGroupId);

      if (nodeGroup) {
        nodeGroup.members.push(action.payload.nodeId);
      }
    },

    removeNodeFromNodeGroup: (
      state,
      action: PayloadAction<{ nodeGroupId: string; nodeId: string }>
    ) => {
      const nodeGroup = getNodeGroupById(state, action.payload.nodeGroupId);

      if (nodeGroup) {
        nodeGroup.members = nodeGroup.members.filter(
          (nodeId) => nodeId !== action.payload.nodeId
        );
      }
    },

    deleteNodeGroup: (state, action: PayloadAction<string>) =>
      state.filter((nodeGroup) => nodeGroup.id !== action.payload),

    changeNodeGroupPosition: (
      state,
      action: PayloadAction<{
        nodeGroupId: string;
        positionIndexChange: 1 | -1;
      }>
    ) => {
      const nodeGroupIndex = state.findIndex(
        (nodeGroup) => nodeGroup.id === action.payload.nodeGroupId
      );

      if (nodeGroupIndex !== -1) {
        const nodeGroup = state[nodeGroupIndex];
        state.splice(nodeGroupIndex, 1);
        state.splice(
          Math.max(nodeGroupIndex + action.payload.positionIndexChange),
          0,
          nodeGroup
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, (_, action) => action.payload.nodeGroups || [])
      .addCase(deleteNode, (state, action) =>
        state.map((nodeGroup) => ({
          ...nodeGroup,
          members: nodeGroup.members.filter(
            (nodeId) => nodeId !== action.payload
          ),
        }))
      );
  },
});

export const {
  addBlankNodeGroup,
  changeNodeGroupName,
  changeNodeGroupActivation,
  changeNodeGroupPosition,
  addNodeToNodeGroup,
  removeNodeFromNodeGroup,
  deleteNodeGroup,
} = nodeGroupsSlice.actions;

export default nodeGroupsSlice.reducer;
