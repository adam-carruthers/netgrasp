import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { uploadGraph } from "./commonActions";
import { deleteNode } from "./fullGraphSlice";
import { startToggleNodesInPinGroup } from "./ongoingEditSlice";

export interface NodePin {
  fx: number;
  fy: number;
}

export interface PinGroup {
  id: string;
  name: string;
  active: boolean;
  pins: {
    [nodeId: string]: NodePin;
  };
}

const getPinGroupById = (state: PinGroup[], pinGroupId: string) => {
  const pinGroup = state.find((pinGroup) => pinGroup.id === pinGroupId);
  if (!pinGroup) {
    console.error("Couldn't find pin group", pinGroupId);
  }
  return pinGroup;
};

const pinGroupsSlice = createSlice({
  name: "pinGroups",
  initialState: [] as PinGroup[],
  reducers: {
    addBlankPinGroup: (state) => {
      state.push({
        id: nanoid(),
        name: "New Pin Group",
        active: false,
        pins: {},
      });
    },

    changePinGroupName: (
      state,
      action: PayloadAction<{ pinGroupId: string; newName: string }>
    ) => {
      const pinGroup = getPinGroupById(state, action.payload.pinGroupId);

      if (pinGroup) {
        pinGroup.name = action.payload.newName;
      }
    },

    changePinGroupActivation: (
      state,
      action: PayloadAction<{ pinGroupId: string; newActivation: boolean }>
    ) => {
      const pinGroup = getPinGroupById(state, action.payload.pinGroupId);

      if (pinGroup) {
        pinGroup.active = action.payload.newActivation;
      }
    },

    fixNodeInPinGroup: (
      state,
      action: PayloadAction<{
        pinGroupId: string;
        nodeId: string;
        fx: number;
        fy: number;
      }>
    ) => {
      const { pinGroupId, nodeId, fx, fy } = action.payload;
      const pinGroup = getPinGroupById(state, pinGroupId);

      if (pinGroup) {
        pinGroup.pins[nodeId] = { fx, fy };
      }
    },

    removeNodeFromPinGroup: (
      state,
      action: PayloadAction<{ pinGroupId: string; nodeId: string }>
    ) => {
      const pinGroup = getPinGroupById(state, action.payload.pinGroupId);

      if (pinGroup) {
        delete pinGroup.pins[action.payload.nodeId];
      }
    },

    deletePinGroup: (state, action: PayloadAction<string>) =>
      state.filter((pinGroup) => pinGroup.id !== action.payload),

    changePinGroupPosition: (
      state,
      action: PayloadAction<{
        pinGroupId: string;
        positionIndexChange: 1 | -1;
      }>
    ) => {
      const pinGroupIndex = state.findIndex(
        (pinGroup) => pinGroup.id === action.payload.pinGroupId
      );

      if (pinGroupIndex !== -1) {
        const pinGroup = state[pinGroupIndex];
        state.splice(pinGroupIndex, 1);
        state.splice(
          Math.max(pinGroupIndex + action.payload.positionIndexChange, 0),
          0,
          pinGroup
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, (_, action) => action.payload.pinGroups || [])
      .addCase(deleteNode, (state, action) => {
        state.forEach((pinGroup) => {
          delete pinGroup.pins[action.payload];
        });
      })
      .addCase(startToggleNodesInPinGroup, (state, action) => {
        const pinGroup = getPinGroupById(state, action.payload.pinGroupId);

        if (pinGroup) {
          pinGroup.active = true;
        }
      });
  },
});

export const {
  addBlankPinGroup,
  changePinGroupName,
  changePinGroupActivation,
  fixNodeInPinGroup,
  removeNodeFromPinGroup,
  deletePinGroup,
  changePinGroupPosition,
} = pinGroupsSlice.actions;

export default pinGroupsSlice.reducer;
