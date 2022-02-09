import {
  selectAllCombinesNodeIdMap,
  selectCombinedGraphLinks,
  selectCombinedGraphNodes,
  selectCombineLogicalChildDeviceMap,
  selectGraphToView,
  selectHighlightedNodeId,
  selectNodeGroupDeviceMap,
  selectSelectedPathNodeIdSteps,
  selectSelectedPathNodeIdStepsLimited,
} from "../reselectView";

const standardPinSourceProperties = {
  fx: null,
  fy: null,
  pinSourceGroupId: null,
};

const standardOutputtedFadingNodeProperties = {
  hasCombinedChildren: false,
  logicalChildren: [],
  ...standardPinSourceProperties,
};

const standardOutputtedNodeGroupProperties = {
  ...standardPinSourceProperties,
  ongoingEditIsTransparent: false,
};

const standardOutputtedNodeProperties = {
  ...standardOutputtedFadingNodeProperties,
  ongoingEditIsTransparent: false,
  alreadyInLogicalGroupWarning: false,
};

const standardState = {
  pinGroups: {
    default: {
      id: "abcd",
      name: "standard",
      active: false,
      pins: {},
    },
    other: [],
  },
  ongoingEdit: null,
};

const emptyNodeGroups = {
  nodeGroups: [],
  fadingNodeGroups: [],
};

describe("selectHighlightedNodeId", () => {
  test("should select the highlighted node id", () => {
    expect(
      selectHighlightedNodeId({
        highlighted: { hNode: "abcd" },
      })
    ).toEqual("abcd");
  });
});

describe("selectSelectedPathSteps", () => {
  test("should correctly select the selected path steps", () => {
    expect(
      selectSelectedPathNodeIdSteps({
        selectedPath: "abcd",
        paths: [
          {
            id: "not the one",
          },
          {
            id: "abcd",
            steps: [{ nodeId: "isTheOne" }],
          },
          {
            id: "meh",
          },
        ],
      })
    ).toEqual(["isTheOne"]);
  });
  test("should fall back nicely when selectedPath is wrong", () => {
    expect(
      selectSelectedPathNodeIdSteps({
        selectedPath: "abcdd",
        paths: [
          {
            id: "abcd",
            steps: "is the one",
          },
        ],
      })
    ).toEqual(null);
  });
  test("should give null when no path is selected", () => {
    expect(
      selectSelectedPathNodeIdSteps({
        selectedPath: null,
        paths: [
          {
            id: "abcd",
            steps: "is the one",
          },
        ],
      })
    ).toEqual(null);
  });
});

describe("selectSelectedPathStepsLimited", () => {
  test("should not limit when showFull is true", () => {
    expect(
      selectSelectedPathNodeIdStepsLimited({
        view: {
          combineLogical: false,
        },
        selectedPath: "abcd",
        fullGraph: {
          nodes: [
            // would have data but don't think necessary for this tes
          ],
        },
        paths: [
          {
            id: "abcd",
            steps: [
              { nodeId: "isTheOne" },
              { nodeId: "isTheTwo" },
              { nodeId: "isTheOne" },
            ],
          },
        ],
        pathView: {
          showFull: true,
          limit: 1,
        },
      })
    ).toEqual(["isTheOne", "isTheTwo", "isTheOne"]);
  });
  test("should limit when showFull is false", () => {
    expect(
      selectSelectedPathNodeIdStepsLimited({
        view: { combineLogical: false },
        fullGraph: {
          nodes: [
            // would have data but don't think necessary for this tes
          ],
        },
        selectedPath: "abcd",
        paths: [
          {
            id: "abcd",
            steps: [
              { nodeId: "isTheOne" },
              { nodeId: "isTheTwo" },
              { nodeId: "isTheOne" },
              { nodeId: "isTheThree" },
            ],
          },
        ],
        pathView: {
          showFull: false,
          limit: 2,
        },
      })
    ).toEqual(["isTheOne", "isTheTwo"]);
  });
});

describe("selectGraphToView", () => {
  test("should give back the full graph when the view style is full", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: { viewStyle: "full", fadingLinks: true, combineLogical: false },
        fullGraph: {
          nodes: [{ id: "aNode" }, { id: "bNode" }, { id: "cNode" }],
          links: [{ source: "aNode", target: "bNode" }],
        },
      })
    ).toEqual({
      nodes: [
        { id: "aNode", ...standardOutputtedNodeProperties },
        { id: "bNode", ...standardOutputtedNodeProperties },
        { id: "cNode", ...standardOutputtedNodeProperties },
      ],
      links: [{ source: "aNode", target: "bNode" }],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });
  });

  test("should give back just the neighbors on focus view no fading links", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "focus",
          fadingLinks: false,
          focusNodeId: "bNode",
          combineLogical: false,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
          ],
        },
      })
    ).toEqual({
      nodes: [
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "aNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "cNode",
          ...standardOutputtedNodeProperties,
        },
      ],
      links: [
        { source: "aNode", target: "bNode" },
        { source: "bNode", target: "cNode" },
      ],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });

    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "focus",
          fadingLinks: false,
          focusNodeId: "fNode",
          combineLogical: false,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
          ],
        },
      })
    ).toEqual({
      nodes: [
        {
          id: "fNode",
          ...standardOutputtedNodeProperties,
        },
      ],
      links: [],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });
  });

  test("should give back two steps of neighbors on focus view with fading links", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "focus",
          fadingLinks: true,
          focusNodeId: "bNode",
          combineLogical: false,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
          ],
        },
        ongoingEdit: null,
      })
    ).toEqual({
      nodes: [
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "aNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "cNode",
          ...standardOutputtedNodeProperties,
        },
      ],
      links: [
        { source: "aNode", target: "bNode" },
        { source: "bNode", target: "cNode" },
      ],
      fadingNodes: [
        {
          id: "dNode",
          hasCombinedChildren: false,
          logicalChildren: [],
          fx: null,
          fy: null,
          pinSourceGroupId: null,
        },
      ],
      fadingLinks: [{ source: "cNode", target: "dNode" }],
      ...emptyNodeGroups,
    });
  });

  test("should correctly apply the subset transparency", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: { viewStyle: "full", fadingLinks: true, combineLogical: false },
        fullGraph: {
          nodes: [{ id: "aNode" }, { id: "bNode" }, { id: "cNode" }],
          links: [{ source: "aNode", target: "bNode" }],
        },
        ongoingEdit: {
          editType: "editSubsetView",
          subsetViewId: "idekam",
        },
        subsetViews: [
          { id: "should be ignored" },
          { id: "idekam", nodes: ["bNode"] },
        ],
      })
    ).toEqual({
      nodes: [
        {
          id: "aNode",
          ...standardOutputtedNodeProperties,
          ongoingEditIsTransparent: true,
        },
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
          ongoingEditIsTransparent: false,
        },
        {
          id: "cNode",
          ...standardOutputtedNodeProperties,
          ongoingEditIsTransparent: true,
        },
      ],
      links: [{ source: "aNode", target: "bNode" }],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });

    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "focus",
          fadingLinks: false,
          focusNodeId: "fNode",
          combineLogical: false,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
          ],
        },
        ongoingEdit: {
          editType: "editSubsetView",
          subsetViewId: "idekam",
        },
        subsetViews: [
          { id: "should be ignored" },
          { id: "idekam", nodes: ["bNode", "eNode"] },
        ],
      })
    ).toEqual({
      nodes: [
        {
          id: "fNode",
          ...standardOutputtedNodeProperties,
          ongoingEditIsTransparent: true,
        },
      ],
      links: [],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });
  });

  test("can show only the nodes in a path", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: { viewStyle: "path", fadingLinks: false, combineLogical: false },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
          ],
        },
        ongoingEdit: null,
        selectedPath: "somePath",
        paths: [
          { id: "ignoreMe" },
          { id: "alsoIgnoreMe" },
          {
            id: "somePath",
            steps: [
              { nodeId: "fNode" },
              { nodeId: "dNode" },
              { nodeId: "fNode" },
              { nodeId: "bNode" },
              { nodeId: "aNode" },
              { nodeId: "fNode" },
            ],
          },
        ],
      })
    ).toEqual({
      nodes: [
        {
          id: "fNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "dNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "aNode",
          ...standardOutputtedNodeProperties,
        },
      ],
      links: [{ source: "aNode", target: "bNode" }],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });
  });

  test("can show only the nodes in a subset view", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "subset",
          fadingLinks: false,
          subsetViewId: "aaaa",
          combineLogical: false,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
          ],
        },
        selectedPath: null,
        paths: [],
        subsetViews: [
          {
            id: "aaaa",
            nodes: ["dNode", "eNode"],
          },
        ],
      })
    ).toEqual({
      nodes: [
        {
          id: "dNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "eNode",
          ...standardOutputtedNodeProperties,
        },
      ],
      links: [{ source: "dNode", target: "eNode" }],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });
  });

  test("should be able to pin nodes", () => {
    expect(
      selectGraphToView({
        view: { viewStyle: "full", fadingLinks: true, combineLogical: false },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
          ],
          links: [{ source: "aNode", target: "bNode" }],
        },
        ongoingEdit: null,
        pinGroups: {
          default: {
            id: "default",
            active: true,
            pins: { eNode: { fx: -1, fy: -2 } },
          },
          other: [
            {
              id: "pinnn",
              active: true,
              pins: {
                aNode: { fx: 5, fy: 6 },
                bNode: { fx: 7, fy: 8 },
                eNode: { fx: -100, fy: -200 },
              },
            },
            {
              id: "pinnnIgnoreMe",
              active: false,
              pins: { dNode: { fx: 99, fy: 100 } },
            },
            {
              id: "pinnnLowerPriority",
              active: true,
              pins: { bNode: { fx: 9, fy: 10 }, cNode: { fx: 11, fy: 12 } },
            },
          ],
        },
      })
    ).toEqual({
      nodes: [
        {
          id: "aNode",
          ...standardOutputtedNodeProperties,
          fx: 5,
          fy: 6,
          pinSourceGroupId: "pinnn",
        },
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
          fx: 7,
          fy: 8,
          pinSourceGroupId: "pinnn",
        },
        {
          id: "cNode",
          ...standardOutputtedNodeProperties,
          fx: 11,
          fy: 12,
          pinSourceGroupId: "pinnnLowerPriority",
        },
        { id: "dNode", ...standardOutputtedNodeProperties },
        {
          id: "eNode",
          ...standardOutputtedNodeProperties,
          fx: -1,
          fy: -2,
          pinSourceGroupId: "default",
        },
      ],
      links: [{ source: "aNode", target: "bNode" }],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });
  });

  test("toggle pin nodes edit works correctly", () => {
    expect(
      selectGraphToView({
        view: { viewStyle: "full", fadingLinks: true, combineLogical: false },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
          ],
          links: [{ source: "aNode", target: "bNode" }],
        },
        ongoingEdit: {
          editType: "toggleNodesInPinGroup",
          pinGroupId: "pinnnLowerPriority",
        },
        pinGroups: {
          default: {
            id: "default",
            active: true,
            pins: { eNode: { fx: -1, fy: -2 } },
          },
          other: [
            {
              id: "pinnn",
              active: true,
              pins: { aNode: { fx: 5, fy: 6 }, bNode: { fx: 7, fy: 8 } },
            },
            {
              id: "pinnnIgnoreMe",
              active: false,
              pins: { dNode: { fx: 99, fy: 100 } },
            },
            {
              id: "pinnnLowerPriority",
              active: true,
              pins: {
                bNode: { fx: 9, fy: 10 },
                cNode: { fx: 11, fy: 12 },
                eNode: { fx: -100, fy: -200 },
              },
            },
          ],
        },
      })
    ).toEqual({
      nodes: [
        {
          id: "aNode",
          ...standardOutputtedNodeProperties,
          fx: 5,
          fy: 6,
          pinSourceGroupId: "pinnn",
          ongoingEditIsTransparent: true,
        },
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
          fx: 9,
          fy: 10,
          pinSourceGroupId: "pinnnLowerPriority",
        },
        {
          id: "cNode",
          ...standardOutputtedNodeProperties,
          fx: 11,
          fy: 12,
          pinSourceGroupId: "pinnnLowerPriority",
        },
        {
          id: "dNode",
          ...standardOutputtedNodeProperties,
          ongoingEditIsTransparent: true,
        },
        {
          id: "eNode",
          ...standardOutputtedNodeProperties,
          fx: -100,
          fy: -200,
          pinSourceGroupId: "pinnnLowerPriority",
          ongoingEditIsTransparent: false,
        },
      ],
      links: [{ source: "aNode", target: "bNode" }],
      fadingNodes: [],
      fadingLinks: [],
      ...emptyNodeGroups,
    });
  });
});

describe("combineLogical true", () => {
  test("selectCombineLogicalChildrenMap works", () => {
    expect(
      selectCombineLogicalChildDeviceMap({
        view: { combineLogical: true },
        fullGraph: {
          nodes: [
            { id: "ignoreMe" },
            { id: "parent" },
            { id: "child1", logicalParent: "parent" },
            { id: "child2", logicalParent: "parent" },
          ],
        },
      })
    ).toEqual({
      child1: "parent",
      child2: "parent",
    });
  });

  test("selectFullGraphCombinedNodes works", () => {
    expect(
      selectCombinedGraphNodes({
        view: { combineLogical: true },
        fullGraph: {
          nodes: [
            { id: "ignoreMe", name: "A" },
            { id: "parent", name: "B" },
            { id: "child1", logicalParent: "parent", name: "C" },
            { id: "child2", logicalParent: "parent", name: "D" },
          ],
        },
      })
    ).toEqual([
      {
        id: "ignoreMe",
        name: "A",
        logicalChildren: [],
        hasCombinedChildren: false,
      },
      {
        id: "parent",
        name: "B",
        logicalChildren: ["child1", "child2"],
        hasCombinedChildren: true,
      },
    ]);
  });

  test("selectFullGraphLogicalCombinedLinks works", () => {
    expect(
      selectCombinedGraphLinks({
        view: { combineLogical: true },
        fullGraph: {
          nodes: [
            { id: "A" },
            { id: "B" },
            { id: "C", logicalParent: "B" },
            { id: "D" },
            { id: "E" },
          ],
          links: [
            { source: "A", target: "B" },
            { source: "C", target: "B" },
            { source: "C", target: "D" },
            { source: "E", target: "D" },
          ],
        },
      })
    ).toEqual([
      { source: "A", target: "B" },
      { source: "B", target: "D" },
      { source: "E", target: "D" },
    ]);
  });

  test("selectSelectedPathNodeIdStepsLimited works", () => {
    expect(
      selectSelectedPathNodeIdStepsLimited({
        view: { combineLogical: true },
        fullGraph: {
          nodes: [
            { id: "A" },
            { id: "B" },
            { id: "C", logicalParent: "B" },
            { id: "D" },
            { id: "E" },
          ],
        },
        selectedPath: "abcd",
        pathView: { showFull: false, limit: 4 },
        paths: [
          {
            id: "abcd",
            steps: [
              { nodeId: "E" },
              { nodeId: "C" },
              { nodeId: "A" },
              { nodeId: "B" },
              { nodeId: "E" },
            ],
          },
        ],
      })
    ).toEqual(["E", "B", "A", "B"]);
  });

  test("can show only the nodes in a subset view", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "subset",
          fadingLinks: true,
          subsetViewId: "aaaa",
          combineLogical: true,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode", logicalParent: "bNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode", logicalParent: "dNode" },
            { id: "gNode" },
            { id: "hNode" },
            { id: "iNode", logicalParent: "aNode" },
            { id: "jNode", logicalParent: "hNode" },
            { id: "kNode", logicalParent: "lNode" },
            { id: "lNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
            { source: "eNode", target: "fNode" },
            { source: "fNode", target: "gNode" },
            { source: "gNode", target: "hNode" },
            { source: "eNode", target: "iNode" },
          ],
        },
        ongoingEdit: null,
        selectedPath: null,
        paths: [],
        subsetViews: [
          {
            id: "aaaa",
            nodes: ["bNode", "cNode", "dNode", "eNode", "kNode"],
          },
        ],
      })
    ).toEqual({
      nodes: [
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
          logicalChildren: ["cNode"],
          hasCombinedChildren: true,
        },
        {
          id: "dNode",
          ...standardOutputtedNodeProperties,
          logicalChildren: ["fNode"],
          hasCombinedChildren: true,
        },
        {
          id: "eNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "lNode",
          ...standardOutputtedNodeProperties,
          logicalChildren: ["kNode"],
          hasCombinedChildren: true,
        },
      ],
      links: [
        { source: "bNode", target: "dNode" },
        { source: "dNode", target: "eNode" },
        { source: "eNode", target: "dNode" },
      ],
      fadingNodes: [
        {
          id: "aNode",
          logicalChildren: ["iNode"],
          hasCombinedChildren: true,
          fx: null,
          fy: null,
          pinSourceGroupId: null,
        },
        {
          id: "gNode",
          logicalChildren: [],
          hasCombinedChildren: false,
          fx: null,
          fy: null,
          pinSourceGroupId: null,
        },
      ],
      fadingLinks: [
        { source: "aNode", target: "bNode" },
        { source: "dNode", target: "gNode" },
        { source: "eNode", target: "aNode" },
      ],
      ...emptyNodeGroups,
    });
  });
});

describe("node groups", () => {
  test("selectNodeGroupDeviceMap", () => {
    expect(
      selectNodeGroupDeviceMap({
        nodeGroups: [
          { id: "1", active: true, members: ["a", "b"] },
          { id: "2", active: false, members: ["b", "c"] },
          { id: "3", active: true, members: ["b", "d"] },
        ],
      })
    ).toEqual({
      a: "1",
      b: "1",
      d: "3",
    });
  });

  test("can correctly create a combine map with logical and node groups", () => {
    expect(
      selectAllCombinesNodeIdMap({
        view: {
          combineLogical: true,
        },
        fullGraph: {
          nodes: [
            { id: "n-a" },
            { id: "n-b" },
            { id: "n-c", logicalParent: "n-b" },
            { id: "n-d" },
            { id: "n-e", logicalParent: "n-d" },
            { id: "n-f" },
            { id: "n-g", logicalParent: "n-f" },
            { id: "n-h" },
            { id: "n-i", logicalParent: "n-h" },
          ],
        },
        nodeGroups: [
          {
            id: "ng-1",
            active: true,
            members: ["n-d", "n-g", "n-h", "n-i"],
          },
        ],
      })
    ).toEqual({
      // node b and c both aren't in the group
      // node c is child of d so is absorbed there
      "n-c": "n-b",
      // node d is in the group
      // node e is the child
      // hence both end up in the group
      "n-d": "ng-1",
      "n-e": "ng-1",
      // node g is in the group
      // however its parent node f isn't
      // logical combines take priority over groups
      // the node ends up combined not in the group
      "n-g": "n-f",
      // node h and i are both in the group
      // i is the child of h so ends up in the group with h
      "n-h": "ng-1",
      "n-i": "ng-1",
    });
  });

  test("full view style", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: { viewStyle: "full", fadingLinks: true, combineLogical: false },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "aNode" },
          ],
        },
        ongoingEdit: null,
        nodeGroups: [
          {
            id: "ng-1",
            active: "true",
            members: ["aNode", "dNode"],
          },
        ],
      })
    ).toEqual({
      nodes: [
        { id: "bNode", ...standardOutputtedNodeProperties },
        { id: "cNode", ...standardOutputtedNodeProperties },
      ],
      links: [
        { source: "ng-1", target: "bNode" },
        { source: "bNode", target: "cNode" },
        { source: "cNode", target: "ng-1" },
      ],
      fadingNodes: [],
      fadingLinks: [],
      nodeGroups: [
        {
          id: "ng-1",
          active: "true",
          members: ["aNode", "dNode"],
          ...standardOutputtedNodeGroupProperties,
        },
      ],
      fadingNodeGroups: [],
    });
  });

  test("focus view", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "focus",
          fadingLinks: true,
          focusNodeId: "cNode",
          combineLogical: false,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "bNode" },
            { id: "cNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode" },
            { id: "gNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
            { source: "eNode", target: "fNode" },
            { source: "fNode", target: "gNode" },
          ],
        },
        nodeGroups: [
          {
            id: "ng-1",
            active: "true",
            members: ["dNode", "eNode"],
          },
          {
            id: "ng-2",
            active: "true",
            members: ["fNode", "gNode"],
          },
        ],
        ongoingEdit: null,
      })
    ).toEqual({
      nodes: [
        {
          id: "cNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "bNode",
          ...standardOutputtedNodeProperties,
        },
      ],
      links: [
        { source: "bNode", target: "cNode" },
        { source: "cNode", target: "ng-1" },
      ],
      fadingNodes: [
        {
          id: "aNode",
          ...standardOutputtedFadingNodeProperties,
        },
      ],
      fadingLinks: [
        { source: "aNode", target: "bNode" },
        { source: "ng-1", target: "ng-2" },
      ],
      nodeGroups: [
        {
          id: "ng-1",
          active: "true",
          members: ["dNode", "eNode"],
          ...standardOutputtedNodeGroupProperties,
        },
      ],
      fadingNodeGroups: [
        {
          id: "ng-2",
          active: "true",
          members: ["fNode", "gNode"],
          ...standardPinSourceProperties,
        },
      ],
    });
  });

  test("can show only the nodes in a subset view", () => {
    expect(
      selectGraphToView({
        ...standardState,
        view: {
          viewStyle: "subset",
          fadingLinks: true,
          subsetViewId: "aaaa",
          combineLogical: true,
        },
        fullGraph: {
          nodes: [
            { id: "aNode" },
            { id: "-aNode" },
            { id: "bNode" },
            { id: "cNode", logicalParent: "bNode" },
            { id: "dNode" },
            { id: "eNode" },
            { id: "fNode", logicalParent: "dNode" },
            { id: "gNode" },
            { id: "hNode" },
            { id: "iNode", logicalParent: "aNode" },
            { id: "jNode", logicalParent: "hNode" },
            { id: "kNode", logicalParent: "lNode" },
            { id: "lNode" },
          ],
          links: [
            { source: "aNode", target: "bNode" },
            { source: "bNode", target: "cNode" },
            { source: "cNode", target: "dNode" },
            { source: "dNode", target: "eNode" },
            { source: "eNode", target: "fNode" },
            { source: "fNode", target: "gNode" },
            { source: "gNode", target: "hNode" },
            { source: "eNode", target: "iNode" },
          ],
        },
        ongoingEdit: null,
        selectedPath: null,
        paths: [],
        subsetViews: [
          {
            id: "aaaa",
            nodes: ["bNode", "cNode", "dNode", "eNode", "kNode"],
          },
        ],
        nodeGroups: [
          {
            id: "ng1",
            active: true,
            members: ["-aNode", "bNode"],
          },
        ],
      })
    ).toEqual({
      nodes: [
        {
          id: "dNode",
          ...standardOutputtedNodeProperties,
          logicalChildren: ["fNode"],
          hasCombinedChildren: true,
        },
        {
          id: "eNode",
          ...standardOutputtedNodeProperties,
        },
        {
          id: "lNode",
          ...standardOutputtedNodeProperties,
          logicalChildren: ["kNode"],
          hasCombinedChildren: true,
        },
      ],
      links: [
        { source: "ng1", target: "dNode" },
        { source: "dNode", target: "eNode" },
        { source: "eNode", target: "dNode" },
      ],
      fadingNodes: [
        {
          id: "aNode",
          logicalChildren: ["iNode"],
          hasCombinedChildren: true,
          fx: null,
          fy: null,
          pinSourceGroupId: null,
        },
        {
          id: "gNode",
          logicalChildren: [],
          hasCombinedChildren: false,
          fx: null,
          fy: null,
          pinSourceGroupId: null,
        },
      ],
      fadingLinks: [
        { source: "aNode", target: "ng1" },
        { source: "dNode", target: "gNode" },
        { source: "eNode", target: "aNode" },
      ],
      nodeGroups: [
        {
          id: "ng1",
          active: true,
          members: ["-aNode", "bNode"],
          ...standardOutputtedNodeGroupProperties,
        },
      ],
      fadingNodeGroups: [],
    });
  });
});
