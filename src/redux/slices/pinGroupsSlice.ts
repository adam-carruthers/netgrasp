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

export interface PinGroupReducer {
  default: PinGroup;
  other: PinGroup[];
}

const getPinGroupById = (state: PinGroupReducer, pinGroupId: string) => {
  if (state.default.id === pinGroupId) return state.default;
  const pinGroup = state.other.find((pinGroup) => pinGroup.id === pinGroupId);
  if (!pinGroup) {
    console.error("Couldn't find pin group", pinGroupId);
  }
  return pinGroup;
};

const createBlankPinGroup = (): PinGroup => ({
  id: nanoid(),
  name: "New Pin Group",
  active: false,
  pins: {},
});

const createInitialState = (): PinGroupReducer => ({
  default: createBlankPinGroup(),
  other: [],
});

const pinGroupsSlice = createSlice({
  name: "pinGroups",
  initialState: createInitialState() as PinGroupReducer,
  reducers: {
    addBlankPinGroup: (state) => {
      state.other.push(createBlankPinGroup());
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

    deletePinGroup: (state, action: PayloadAction<string>) => {
      state.other = state.other.filter(
        (pinGroup) => pinGroup.id !== action.payload
      );
    },

    changePinGroupPosition: (
      state,
      action: PayloadAction<{
        pinGroupId: string;
        positionIndexChange: 1 | -1;
      }>
    ) => {
      const pinGroupIndex = state.other.findIndex(
        (pinGroup) => pinGroup.id === action.payload.pinGroupId
      );

      if (pinGroupIndex !== -1) {
        const pinGroup = state.other[pinGroupIndex];
        state.other.splice(pinGroupIndex, 1);
        state.other.splice(
          Math.max(pinGroupIndex + action.payload.positionIndexChange, 0),
          0,
          pinGroup
        );
      }
    },

    makePinGroupDefault: (
      state,
      action: PayloadAction<{ pinGroupId: string }>
    ) => {
      const newDefaultPinGroup = state.other.find(
        (pinGroup) => pinGroup.id === action.payload.pinGroupId
      );

      if (newDefaultPinGroup) {
        state.other = [
          state.default,
          ...state.other.filter(
            (pinGroup) => pinGroup.id !== action.payload.pinGroupId
          ),
        ];
        state.default = newDefaultPinGroup;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGraph, (_, action) => {
        if (!action.payload.pinGroups) {
          return createInitialState();
        }
        if (Array.isArray(action.payload.pinGroups)) {
          return {
            default: {
              id: nanoid(),
              name: "Default Pin Group",
              active: true,
              pins: {},
            },
            other: action.payload.pinGroups,
          };
        }
        return action.payload.pinGroups;
      })
      .addCase(deleteNode, (state, action) => {
        delete state.default.pins[action.payload];
        state.other.forEach((pinGroup) => {
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
  makePinGroupDefault,
} = pinGroupsSlice.actions;

export default pinGroupsSlice.reducer;
