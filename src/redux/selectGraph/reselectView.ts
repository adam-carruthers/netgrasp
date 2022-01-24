import { createSelector } from "@reduxjs/toolkit";
import focusViewGetSubgraph from "./focusView";
import {
  getLinksWithinNodeSet,
  getNodesLinksDirectlyConnectedToNodeSet,
} from "./networkOperations";
import type { RootState } from "../reduxStore";
import type { ReduxLink, ReduxNode } from "../slices/fullGraphSlice";
import type { Path } from "../slices/pathsSlice";
import { NodePin } from "../slices/pinGroupsSlice";

//
// Basic selectors
//
const selectFullGraph = (state: RootState) => state.fullGraph;
const selectFullGraphLinks = (state: RootState) => state.fullGraph.links;
const selectFullGraphNodes = (state: RootState) => state.fullGraph.nodes;
const selectView = (state: RootState) => state.view;
const selectFadingLinks = (state: RootState) => state.view.fadingLinks;
const selectCombineLogical = (state: RootState) => state.view.combineLogical;
const selectFocusViewDistance = (state: RootState) =>
  state.view.focusViewDistance;
const selectSubsetViews = (state: RootState) => state.subsetViews;
const selectPathView = (state: RootState) => state.pathView;
export const selectSelectedPathId = (state: RootState) => state.selectedPath;
const selectPaths = (state: RootState) => state.paths;
export const selectOngoingEdit = (state: RootState) => state.ongoingEdit;
export const selectHighlightedNodeId = (state: RootState) =>
  state.highlighted?.hNode || null;
const selectPinGroups = (state: RootState) => state.pinGroups;

export const selectSearchedNodes = createSelector(
  selectFullGraphNodes,
  (state: any, { searchString }: { searchString: string }) => searchString,
  (nodes, searchString) => {
    if (!searchString) return nodes;

    return nodes.filter((node) =>
      node.name.toLowerCase().includes(searchString.toLowerCase())
    );
  }
);

const selectBeingEditedPinGroup = createSelector(
  selectPinGroups,
  selectOngoingEdit,
  (pinGroups, ongoingEdit) =>
    ongoingEdit?.editType === "toggleNodesInPinGroup"
      ? pinGroups.find((pinGroup) => pinGroup.id === ongoingEdit.pinGroupId) ||
        null
      : null
);

export const selectPinGroupsInOngoingEditOrder = createSelector(
  selectPinGroups,
  selectBeingEditedPinGroup,
  (pinGroups, beingEditedPinGroup) => {
    if (!beingEditedPinGroup) return pinGroups;

    return [
      beingEditedPinGroup,
      ...pinGroups.filter((pinGroup) => pinGroup.id !== beingEditedPinGroup.id),
    ];
  }
);

const selectBeingEditedPinGroupPins = createSelector(
  selectBeingEditedPinGroup,
  (beingEditedPinGroup) => beingEditedPinGroup?.pins || null
);

//
// Getting the highlighted node & associated properties
//
export const selectHighlightedNode = createSelector(
  selectFullGraph,
  selectHighlightedNodeId,
  (fullGraph, highlightedNodeId) =>
    fullGraph.nodes.find((node) => node.id === highlightedNodeId) || null
);
export const createSelectHighlightedNodeProperty =
  (property: keyof ReduxNode) => (state: RootState) => {
    const highlightedNode = selectHighlightedNode(state);
    return highlightedNode?.[property] || null;
  };

export const selectLogicalChildrenOfNode = (
  nodeId: string | null,
  nodes: ReduxNode[]
) =>
  (nodeId &&
    nodes
      .filter((node) => node.logicalParent === nodeId)
      .map((node) => node.id)) ||
  [];

export const selectHighlightedNodeLogicalChildren = createSelector(
  selectHighlightedNodeId,
  selectFullGraphNodes,
  selectLogicalChildrenOfNode
);

export const selectHighlightedNodeLogicalGroup = createSelector(
  selectHighlightedNode,
  selectHighlightedNodeLogicalChildren,
  selectFullGraphNodes,
  (highlightedNode, children, nodes) => {
    if (
      !highlightedNode ||
      (!highlightedNode.logicalParent && children.length === 0)
    ) {
      return null;
    }

    if (highlightedNode.logicalParent) {
      return {
        parent: highlightedNode.logicalParent,
        children: [
          // Make the highlighted node the first in the list of children
          highlightedNode.id,
          ...selectLogicalChildrenOfNode(
            highlightedNode.logicalParent,
            nodes
          ).filter((nodeId) => nodeId !== highlightedNode.id),
        ],
      };
    }

    return {
      parent: highlightedNode.id,
      children,
    };
  }
);

//
// Miscellaneous useful elements for later
//

// => Being edited subset view nodes
const selectBeingEditedSubsetViewNodes = createSelector(
  selectSubsetViews,
  selectOngoingEdit,
  (subsetViews, ongoingEdit) =>
    ongoingEdit?.editType === "editSubsetView"
      ? subsetViews.find(
          (subsetView) => subsetView.id === ongoingEdit.subsetViewId
        )?.nodes || null
      : null
);

// => combining the active pin groups
const selectCombinedPinMap = createSelector(
  selectPinGroupsInOngoingEditOrder,
  (pinGroups) =>
    (pinGroups || [])
      .filter((pinGroup) => pinGroup.active)
      .map((pinGroup) => {
        // Get the pins from the pin group
        // Add details about which pin group the pin info comes from
        const pinEntries = Object.entries(pinGroup.pins);

        const newPinEntries = pinEntries.map(
          ([nodeId, pin]): [string, NodePin & { pinSourceGroupId: string }] => [
            nodeId,
            {
              ...pin,
              pinSourceGroupId: pinGroup.id,
            },
          ]
        );

        return Object.fromEntries(newPinEntries);
      })
      .reduce((prev, current) => ({ ...current, ...prev }), {})
);

//
// Section that deals with logical combining
//

// => Combine logical mappings
export const selectCombineLogicalChildDeviceMap = createSelector(
  selectFullGraphNodes,
  selectCombineLogical,
  (nodes, combineLogical) => {
    if (!combineLogical) return null;

    const out: { [k: string]: string } = {};
    nodes.forEach((node) => {
      if (node.logicalParent) {
        out[node.id] = node.logicalParent;
      }
    });
    return out;
  }
);

interface ReduxNodeWithCombineLogicalInfo extends ReduxNode {
  logicalChildren: string[];
  hasCombinedChildren: boolean;
}

export const selectFullGraphLogicalCombinedNodes = createSelector(
  selectFullGraphNodes,
  selectCombineLogical,
  (nodes, combineLogical): ReduxNodeWithCombineLogicalInfo[] => {
    const combiningNodesCount: { [parentNodeId: string]: string[] } =
      Object.fromEntries(nodes.map((node) => [node.id, []]));

    const uncombinedNodes: ReduxNode[] = [];

    nodes.forEach((node) => {
      if (!node.logicalParent) {
        uncombinedNodes.push(node);
        return;
      }

      combiningNodesCount[node.logicalParent].push(node.id);
    });

    const uncombinedNodesWithCombineInfo: ReduxNodeWithCombineLogicalInfo[] = (
      combineLogical ? uncombinedNodes : nodes
    ) // If combine logical send only nodes that aren't a child of another
      .map((node) => ({
        ...node,
        logicalChildren: combiningNodesCount[node.id],
        hasCombinedChildren:
          combineLogical && !!combiningNodesCount[node.id]?.length,
      }));

    return uncombinedNodesWithCombineInfo;
  }
);

const selectFullGraphLogicalCombinedNodesById = createSelector(
  selectFullGraphLogicalCombinedNodes,
  (nodes) => Object.fromEntries(nodes.map((node) => [node.id, node]))
);

export const selectFullGraphLogicalCombinedLinks = createSelector(
  selectFullGraphLinks,
  selectCombineLogicalChildDeviceMap,
  (links, logicalMap): ReduxLink[] => {
    if (!logicalMap) return links;

    return links
      .map(({ source, target }) => ({
        source: source in logicalMap ? logicalMap[source] : source,
        target: target in logicalMap ? logicalMap[target] : target,
      }))
      .filter(({ source, target }) => source !== target);
  }
);

const selectBeingViewedSubsetViewLogicallyMergedNodeIds = createSelector(
  selectSubsetViews,
  selectView,
  selectCombineLogicalChildDeviceMap,
  (subsetViews, view, logicalMap) => {
    if (view.viewStyle !== "subset") return null;

    const nodeIds =
      subsetViews.find((subsetView) => subsetView.id === view.subsetViewId)
        ?.nodes || [];

    if (!logicalMap) return nodeIds;

    const nodeIdsAfterMerge = nodeIds.map((nodeId) =>
      nodeId in logicalMap ? logicalMap[nodeId] : nodeId
    );

    // Get rid of duplicates
    return Array.from(new Set(nodeIdsAfterMerge));
  }
);

//
// Getting the selected path & associated properties
//
export const selectSelectedPath = createSelector(
  selectSelectedPathId,
  selectPaths,
  (selectedPathId, paths) =>
    (selectedPathId && paths.find((path) => path.id === selectedPathId)) || null
);
export const createSelectSelectedPathProperty =
  (property: keyof Path) => (state: RootState) => {
    const selectedPath = selectSelectedPath(state);
    return selectedPath?.[property] || null;
  };

// => Getting derived path properties
export const selectSelectedPathNodeIdSteps = createSelector(
  selectSelectedPath,
  (selectedPath) => selectedPath?.steps.map((step) => step.nodeId) || null
);
const selectSelectedPathNodeIdStepsLogicalMerged = createSelector(
  selectSelectedPathNodeIdSteps,
  selectCombineLogicalChildDeviceMap,
  (nodeIdSteps, logicalMap): string[] | null => {
    if (!nodeIdSteps || !logicalMap) return nodeIdSteps;

    return nodeIdSteps.map((nodeId) =>
      nodeId in logicalMap ? logicalMap[nodeId] : nodeId
    );
  }
);
export const selectSelectedPathNodeIdStepsLimited = createSelector(
  selectSelectedPathNodeIdStepsLogicalMerged,
  selectPathView,
  (pathNodeIdSteps, pathView) => {
    if (!pathNodeIdSteps || pathView.showFull) return pathNodeIdSteps;

    return pathNodeIdSteps.slice(0, pathView.limit);
  }
);
export const selectSelectedPathNodeIdStepsToView =
  selectSelectedPathNodeIdStepsLimited;

//
// Getting the base nodes in each different view
// E.G: The neighbors of a focussed node
//
const selectBeingViewedPathNodeIdsLinks = createSelector(
  selectView,
  selectSelectedPathNodeIdStepsLogicalMerged,
  selectFullGraphLogicalCombinedLinks,
  (view, pathSteps, fullGraphLinks) => {
    if (view.viewStyle !== "path") return null;

    const nodeIdSet = new Set(pathSteps);
    const [links, remainingLinks] = getLinksWithinNodeSet(
      nodeIdSet,
      fullGraphLinks
    );
    const [fadingNodeIdsSet, fadingLinks] =
      getNodesLinksDirectlyConnectedToNodeSet(nodeIdSet, remainingLinks);

    return {
      nodeIds: Array.from(nodeIdSet),
      links,
      fadingNodeIds: Array.from(fadingNodeIdsSet),
      fadingLinks,
    };
  }
);
const selectBeingViewedSubsetViewNodeIdsLinks = createSelector(
  selectBeingViewedSubsetViewLogicallyMergedNodeIds,
  selectFullGraphLogicalCombinedLinks,
  (subsetViewNodeIds, fullGraphLinks) => {
    if (!subsetViewNodeIds) return null;

    const nodeIdSet = new Set(subsetViewNodeIds);
    const [links, remainingLinks] = getLinksWithinNodeSet(
      nodeIdSet,
      fullGraphLinks
    );
    const [fadingNodeIdsSet, fadingLinks] =
      getNodesLinksDirectlyConnectedToNodeSet(nodeIdSet, remainingLinks);

    return {
      nodeIds: subsetViewNodeIds,
      links,
      fadingNodeIds: Array.from(fadingNodeIdsSet),
      fadingLinks,
    };
  }
);
const selectBeingViewedFocussedNodeIdsLinks = createSelector(
  selectView,
  selectFullGraphLogicalCombinedLinks,
  selectCombineLogicalChildDeviceMap,
  selectFocusViewDistance,
  (view, fullGraphLinks, logicalMap, focusViewDistance) => {
    if (view.viewStyle !== "focus") return null;

    let { focusNodeId } = view;
    if (logicalMap) {
      focusNodeId =
        focusNodeId in logicalMap ? logicalMap[focusNodeId] : focusNodeId;
    }

    return focusViewGetSubgraph(
      fullGraphLinks,
      focusNodeId,
      focusViewDistance || 1
    );
  }
);

//
// Non-full graph transformation section
// This section has the transformations that are done *before* you add the full graph to the mix
//

// => Choose between the view selectors
const selectNodeIdsLinksForViewing = createSelector(
  selectView,
  selectBeingViewedPathNodeIdsLinks,
  selectBeingViewedSubsetViewNodeIdsLinks,
  selectBeingViewedFocussedNodeIdsLinks,
  (view, pathInfo, subsetInfo, focusInfo) => {
    switch (view.viewStyle) {
      case "path":
        return pathInfo;
      case "subset":
        return subsetInfo;
      case "focus":
        return focusInfo;
      case "full":
        return null;
      default:
        // This section should only be reached in error
        // eslint-disable-next-line no-console
        console.error(
          `unrecognised view style "${(view as any).viewStyle}" in reselectView`
        );
        return null;
    }
  }
);

// => Taking the nodeIds from the earlier calculations and mapping them to actual nodes
const selectNodesLinksForViewing = createSelector(
  selectNodeIdsLinksForViewing,
  selectFullGraphLogicalCombinedNodesById,
  (nodeIdsLinksForViewing, nodesById) => {
    if (nodeIdsLinksForViewing === null) return null;

    const { nodeIds, fadingNodeIds, ...linksRest } = nodeIdsLinksForViewing;
    return {
      ...linksRest,
      // eslint-disable-next-line no-console
      nodes: nodeIds.map(
        (nodeId) => nodesById[nodeId] || console.error("unfound node")
      ),
      // eslint-disable-next-line no-console
      fadingNodes: fadingNodeIds.map(
        (nodeId) => nodesById[nodeId] || console.error("unfound node")
      ),
    };
  }
);

const emptyFadingNodes: ReduxNodeWithCombineLogicalInfo[] = [];
const emptyFadingLinks: ReduxLink[] = [];

// => Remove fading links if the view so demands
const selectNodesLinksRemoveFadingLinks = createSelector(
  selectNodesLinksForViewing,
  selectFadingLinks,
  (nodesLinksForViewing, fadingLinks) => {
    if (nodesLinksForViewing === null) return null;

    if (fadingLinks) return nodesLinksForViewing;

    return {
      ...nodesLinksForViewing,
      fadingNodes: emptyFadingNodes,
      fadingLinks: emptyFadingLinks,
    };
  }
);

//
// Add in the full graph
//
const selectNodesLinksIncludingFullGraph = createSelector(
  selectNodesLinksRemoveFadingLinks,
  selectFullGraphLogicalCombinedNodes,
  selectFullGraphLogicalCombinedLinks,
  (nodesLinksForViewing, nodes, links) => {
    if (nodesLinksForViewing) return nodesLinksForViewing;

    return {
      nodes,
      links,
      fadingNodes: emptyFadingNodes,
      fadingLinks: emptyFadingLinks,
    };
  }
);

//
// Graph to be viewed transformations
// Any graph view comes through these transformations, including full graph
//

interface ReduxNodeWithExtraPinInfo extends ReduxNodeWithCombineLogicalInfo {
  fx: number | null;
  fy: number | null;
  pinSourceGroupId: string | null;
}

const selectNodesLinksPinned = createSelector(
  selectNodesLinksIncludingFullGraph,
  selectCombinedPinMap,
  (
    viewGraph,
    pinMap
  ): {
    nodes: ReduxNodeWithExtraPinInfo[];
    fadingNodes: ReduxNodeWithExtraPinInfo[];
    links: ReduxLink[];
    fadingLinks: ReduxLink[];
  } => ({
    ...viewGraph,
    nodes: viewGraph.nodes.map((node) => ({
      ...node,
      ...(pinMap[node.id] || { fx: null, fy: null, pinSourceGroupId: null }),
    })),
    fadingNodes: viewGraph.fadingNodes.map((node) => ({
      ...node,
      ...(pinMap[node.id] || { fx: null, fy: null, pinSourceGroupId: null }),
    })),
  })
);

interface ReduxNodeWithOngoingEditTransparency
  extends ReduxNodeWithExtraPinInfo {
  ongoingEditIsTransparent: boolean;
}

// => Add on transparency if a subsetView edit is ongoing
const selectNodesLinksIncludingEditSubsetTransparency = createSelector(
  selectNodesLinksPinned,
  selectBeingEditedSubsetViewNodes,
  (
    nodesLinksForViewing,
    beingEditedSubsetViewNodes
  ): {
    nodes: ReduxNodeWithOngoingEditTransparency[];
    fadingNodes: ReduxNodeWithExtraPinInfo[];
    links: ReduxLink[];
    fadingLinks: ReduxLink[];
  } => ({
    ...nodesLinksForViewing,
    nodes: nodesLinksForViewing.nodes.map((node) => ({
      ...node,
      ongoingEditIsTransparent: beingEditedSubsetViewNodes
        ? beingEditedSubsetViewNodes.every(
            (nodeInSubsetViewId) => node.id !== nodeInSubsetViewId
          )
        : false,
    })),
  })
);

interface ReduxNodeWithAlreadyInLogicalGroupWarning
  extends ReduxNodeWithOngoingEditTransparency {
  alreadyInLogicalGroupWarning: boolean;
}

const selectNodesLinksIncludingLogicalGroupTransparency = createSelector(
  selectNodesLinksIncludingEditSubsetTransparency,
  selectOngoingEdit,
  (
    nodesLinksForViewing,
    ongoingEdit
  ): {
    nodes: ReduxNodeWithAlreadyInLogicalGroupWarning[];
    fadingNodes: ReduxNodeWithExtraPinInfo[];
    links: ReduxLink[];
    fadingLinks: ReduxLink[];
  } => {
    if (ongoingEdit?.editType !== "toggleNodesInLogicalGroup") {
      return {
        ...nodesLinksForViewing,
        nodes: nodesLinksForViewing.nodes.map((node) => ({
          ...node,
          alreadyInLogicalGroupWarning: false,
        })),
      };
    }

    return {
      ...nodesLinksForViewing,
      nodes: nodesLinksForViewing.nodes.map((node) => {
        const nodeIsInBeingEditedLogicalGroup =
          node.logicalParent === ongoingEdit.parentNodeId ||
          node.id === ongoingEdit.parentNodeId;
        const nodeIsInALogicalGroup =
          !!node.logicalParent || !!node.logicalChildren.length;
        return {
          ...node,
          ongoingEditIsTransparent: !nodeIsInBeingEditedLogicalGroup,
          alreadyInLogicalGroupWarning:
            nodeIsInALogicalGroup && !nodeIsInBeingEditedLogicalGroup,
        };
      }),
    };
  }
);

const selectNodesLinksIncludingPinGroupTransparency = createSelector(
  selectNodesLinksIncludingLogicalGroupTransparency,
  selectBeingEditedPinGroupPins,
  (nodesLinksForViewing, pins) => {
    if (!pins) return nodesLinksForViewing;

    return {
      ...nodesLinksForViewing,
      nodes: nodesLinksForViewing.nodes.map((node) => ({
        ...node,
        ongoingEditIsTransparent: !(node.id in pins),
      })),
    };
  }
);

export const selectGraphToView = selectNodesLinksIncludingPinGroupTransparency;
export type FullGraphSelectedToView = ReturnType<typeof selectGraphToView>;
export type ReduxNodeSelectedToView = FullGraphSelectedToView["nodes"][0];
