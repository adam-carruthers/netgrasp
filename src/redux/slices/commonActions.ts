import { createAction } from "@reduxjs/toolkit";
import type { ReduxLink, ReduxNode } from "./fullGraphSlice";
import type { Path } from "./pathsSlice";
import { PinGroup } from "./pinGroupsSlice";
import type { SubsetView } from "./subsetViewsSlice";

export const uploadGraph = createAction<{
  nodes: ReduxNode[];
  links: ReduxLink[];
  paths?: Path[];
  subsetViews?: SubsetView[];
  pinGroups?: PinGroup[];
}>("uploadGraph");
