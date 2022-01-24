import {
  selectCombineLogicalChildDeviceMap,
  selectFullGraphLogicalCombinedLinks,
  selectFullGraphLogicalCombinedNodes,
  selectGraphToView,
  selectHighlightedNodeId,
  selectSelectedPathNodeIdSteps,
  selectSelectedPathNodeIdStepsLimited,
} from "../reselectView";

const standardOutputtedNodeProperties = {
  ongoingEditIsTransparent: false,
  alreadyInLogicalGroupWarning: false,
  hasCombinedChildren: false,
  logicalChildren: [],
  fx: null,
  fy: null,
  pinSourceGroupId: null,
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
        view: { viewStyle: "full", fadingLinks: true, combineLogical: false },
        fullGraph: {
          nodes: [{ id: "aNode" }, { id: "bNode" }, { id: "cNode" }],
          links: [{ source: "aNode", target: "bNode" }],
        },
        ongoingEdit: null,
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
    });
  });

  test("should give back just the neighbors on focus view no fading links", () => {
    expect(
      selectGraphToView({
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
      fadingNodes: [],
      fadingLinks: [],
    });

    expect(
      selectGraphToView({
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
        ongoingEdit: null,
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
    });
  });

  test("should give back two steps of neighbors on focus view with fading links", () => {
    expect(
      selectGraphToView({
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
    });
  });

  test("should correctly apply the subset transparency", () => {
    expect(
      selectGraphToView({
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
    });

    expect(
      selectGraphToView({
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
    });
  });

  test("can show only the nodes in a path", () => {
    expect(
      selectGraphToView({
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
    });
  });

  test("can show only the nodes in a subset view", () => {
    expect(
      selectGraphToView({
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
        ongoingEdit: null,
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
          ],
          links: [{ source: "aNode", target: "bNode" }],
        },
        ongoingEdit: null,
        pinGroups: [
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
            pins: { bNode: { fx: 9, fy: 10 }, cNode: { fx: 11, fy: 12 } },
          },
        ],
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
      ],
      links: [{ source: "aNode", target: "bNode" }],
      fadingNodes: [],
      fadingLinks: [],
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
          ],
          links: [{ source: "aNode", target: "bNode" }],
        },
        ongoingEdit: {
          editType: "toggleNodesInPinGroup",
          pinGroupId: "pinnnLowerPriority",
        },
        pinGroups: [
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
            pins: { bNode: { fx: 9, fy: 10 }, cNode: { fx: 11, fy: 12 } },
          },
        ],
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
      ],
      links: [{ source: "aNode", target: "bNode" }],
      fadingNodes: [],
      fadingLinks: [],
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

  test("selectFullGraphLogicalCombinedNodes works", () => {
    expect(
      selectFullGraphLogicalCombinedNodes({
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
      selectFullGraphLogicalCombinedLinks({
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
    });
  });
});
