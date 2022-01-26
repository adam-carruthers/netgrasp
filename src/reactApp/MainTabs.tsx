import React, { useCallback, useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ViewTab from "./viewTab/ViewTab";
import FileTab from "./fileTab/FileTab";
import EditNodesTab from "./editNodesTab/EditNodesTab";
import PathsTab from "./pathsTab/PathsTab";
import EditPathTab from "./editPathTab/EditPathTab";
import PinGroupsTab from "./pinGroupsTab/PinGroupsTab";
import NodeSearchTab from "./nodeSearchTab/NodeSearchTab";
import NodeGroupsTab from "./nodeGroupsTab/NodeGroupsTab";

const MainTabs = () => {
  const [key, setKey] = useState<string>("view");

  const goToEditPathsTab = useCallback(() => {
    setKey("editPath");
  }, [setKey]);

  const goToEditNodeTab = useCallback(() => {
    setKey("editNode");
  }, [setKey]);

  return (
    <Tabs activeKey={key} onSelect={(k) => k && setKey(k)}>
      <Tab title="View" eventKey="view">
        <ViewTab />
      </Tab>
      <Tab title="File" eventKey="file">
        <FileTab />
      </Tab>
      <Tab title="Edit Nodes and Links" eventKey="editNode">
        <EditNodesTab />
      </Tab>
      <Tab title="All Paths" eventKey="paths">
        <PathsTab goToEditPathsTab={goToEditPathsTab} />
      </Tab>
      <Tab title="Edit Path" eventKey="editPath">
        <EditPathTab />
      </Tab>
      <Tab title="Pin Groups" eventKey="pinGroups">
        <PinGroupsTab />
      </Tab>
      <Tab title="Node Groups" eventKey="nodeGroups">
        <NodeGroupsTab />
      </Tab>
      <Tab title="Search Nodes" eventKey="search">
        <NodeSearchTab goToEditNodeTab={goToEditNodeTab} />
      </Tab>
      <Tab title="Hide Tabs" eventKey="hideTabs" />
    </Tabs>
  );
};

export default MainTabs;
