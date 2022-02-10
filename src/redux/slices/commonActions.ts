import { createAction } from "@reduxjs/toolkit";
import type { ReduxLink, ReduxNode } from "./fullGraphSlice";
import { NodeGroup } from "./nodeGroupsSlice";
import type { Path } from "./pathsSlice";
import type { PinGroup, PinGroupReducer } from "./pinGroupsSlice";

export const uploadGraph = createAction<{
  nodes: ReduxNode[];
  links: ReduxLink[];
  paths?: Path[];
  pinGroups?: PinGroupReducer | PinGroup[];
  nodeGroups?: NodeGroup[];
}>("uploadGraph");
