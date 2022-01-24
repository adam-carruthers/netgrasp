import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer/dist/internal";
import { nanoid } from "nanoid";
import { uploadGraph } from "./commonActions";
import icons from "../../icons/icons";

export interface ReduxNode {
  id: string;
  name: string;
  icon: keyof typeof icons;
  description: string;
  logicalParent?: string | undefined;
  solarwindsNodeId?: string;
}
export interface ReduxLink {
  source: string;
  target: string;
}

interface FullGraph {
  nodes: ReduxNode[];
  links: ReduxLink[];
}

const initialState: FullGraph = {
  nodes: [],
  links: [],
};

const changeNodePropertyReducer = <
  P extends "name" | "description" | "icon" | "logicalParent"
>(
  state: WritableDraft<FullGraph>,
  nodeId: string,
  property: P,
  newValue: ReduxNode[P]
) => {
  const foundNode = state.nodes.find((node) => node.id === nodeId);
  if (foundNode) {
    foundNode[property] = newValue;
  } else {
    // eslint-disable-next-line no-console
    console.error(`Tried to change node ${nodeId} but it didn't exist.`);
  }
};

const fullGraphSlice = createSlice({
  name: "fullGraph",
  initialState,
  reducers: {
    changeNodeName: (
      state,
      action: PayloadAction<{ nodeId: string; newName: string }>
    ) => {
      changeNodePropertyReducer(
        state,
        action.payload.nodeId,
        "name",
        action.payload.newName
      );
    },

    changeNodeDescription: (
      state,
      action: PayloadAction<{ nodeId: string; newDescription: string }>
    ) => {
      changeNodePropertyReducer(
        state,
        action.payload.nodeId,
        "description",
        action.payload.newDescription
      );
    },

    changeNodeIcon: (
      state,
      action: PayloadAction<{ nodeId: string; newIcon: keyof typeof icons }>
    ) => {
      changeNodePropertyReducer(
        state,
        action.payload.nodeId,
        "icon",
        action.payload.newIcon
      );
    },

    changeNodeLogicalParent: (
      state,
      action: PayloadAction<{
        nodeId: string;
        newParent: string | undefined;
        clearOngoingEdit: boolean;
      }>
    ) => {
      const { nodeId, newParent } = action.payload;

      if (
        newParent &&
        state.nodes.some((node) => node.logicalParent === nodeId)
      ) {
        console.error("Attempted to give a parent to a node that has children");
        return state;
      }

      changeNodePropertyReducer(state, nodeId, "logicalParent", newParent);
    },

    setNewParentOfExistingLogicalGroup: (
      state,
      action: PayloadAction<{
        previousParentId: string;
        newParentId: string;
        keepOldParentInGroup: boolean;
        clearOngoingEdit: boolean;
      }>
    ) => {
      const { previousParentId, newParentId, keepOldParentInGroup } =
        action.payload;

      state.nodes = state.nodes.map((node) => {
        if (node.id === newParentId) {
          return {
            ...node,
            logicalParent: undefined,
          };
        }
        if (node.id === previousParentId) {
          return {
            ...node,
            logicalParent: keepOldParentInGroup ? newParentId : undefined,
          };
        }
        if (node.logicalParent === previousParentId) {
          return {
            ...node,
            logicalParent: newParentId,
          };
        }
        return node;
      });
    },

    clearLogicalGroup: (
      state,
      action: PayloadAction<{ parentNodeId: string }>
    ) => {
      state.nodes
        .filter((node) => node.logicalParent === action.payload.parentNodeId)
        .forEach((node) => {
          node.logicalParent = undefined;
        });
    },

    addNodeWithLinks: (
      state,
      action: PayloadAction<{ newNode: ReduxNode; newLinks: ReduxLink[] }>
    ) => ({
      ...state,
      nodes: [...state.nodes, action.payload.newNode],
      links: [...state.links, ...action.payload.newLinks],
    }),

    addNewDefaultNode: (state, action: PayloadAction<string[] | undefined>) => {
      const newId = nanoid();
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: newId,
            name: "Node",
            icon: "circle",
            description: "",
          },
        ],
        links: [
          ...state.links,
          ...(action.payload?.map((connectionTarget: string) => ({
            source: newId,
            target: connectionTarget,
          })) || []),
        ],
      };
    },

    deleteNode: (state, action: PayloadAction<string>) => ({
      ...state,
      nodes: state.nodes
        .filter((node) => node.id !== action.payload)
        .map((node) =>
          node.logicalParent === action.payload
            ? { ...node, logicalParent: undefined }
            : node
        ),
      links: state.links.filter(
        (link) =>
          link.source !== action.payload && link.target !== action.payload
      ),
    }),

    createLinkAndClearOngoingEdit: (
      state,
      action: PayloadAction<ReduxLink>
    ) => {
      state.links.push(action.payload);
    },

    deleteLinkAndClearOngoingEdit: (
      state,
      action: PayloadAction<ReduxLink>
    ) => {
      // eslint-disable-next-line no-param-reassign
      state.links = state.links.filter(
        (link) =>
          !(
            (link.source === action.payload.source &&
              link.target === action.payload.target) ||
            (link.source === action.payload.target &&
              link.target === action.payload.source)
          )
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // GENERAL ACTIONS
      .addCase(uploadGraph, (_, { payload: { nodes, links } }) => ({
        nodes: nodes.map((node) => ({
          ...node,
          description: node.description || "",
          icon: node.icon || "circle",
        })),
        links,
      }));
  },
});

export const {
  changeNodeName,
  changeNodeDescription,
  changeNodeIcon,
  changeNodeLogicalParent,
  setNewParentOfExistingLogicalGroup,
  clearLogicalGroup,
  addNodeWithLinks,
  addNewDefaultNode,
  deleteNode,
  createLinkAndClearOngoingEdit,
  deleteLinkAndClearOngoingEdit,
} = fullGraphSlice.actions;

export default fullGraphSlice.reducer;
