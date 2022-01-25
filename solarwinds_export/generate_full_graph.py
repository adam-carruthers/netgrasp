import csv
import json

with open('./orion_generated_connectivity.csv') as f:
    reader = csv.DictReader(f)
    connections = list(reader)

with open('./orion_full_node_list.csv') as f:
    reader = csv.DictReader(f)
    network_nodes = list(reader)

nodesById = {}
links = []


def processNode(name, nodeDesc, machineType, nodeId):
    if nodeId not in nodesById:
        if "WLC" in name:
            icon = "wlc"
        elif "BIG-IP" in machineType:
            icon = "f5"
        elif "APIC Server" in machineType:
            icon = "server"
        elif (
            "Adaptive Security Appliance" in nodeDesc or
            "Firepower" in nodeDesc
        ):
            icon = "firewall"
        elif (
            "Nexus" in machineType or
            "L3 Switch" in nodeDesc or
            "Cisco Catalyst" in machineType or
            "Cisco N9K" in machineType
        ):
            icon = "l3switch"
        elif (
            "RTR" in name or
            "ASR" in machineType or
            "Cisco ISR" in machineType
        ):
            icon = "router"
        else:
            icon = None

        if name.lower().endswith('.corp.internal'):
            name = name[:-14]

        nodesById[nodeId] = {
            "id": f'Orion:{nodeId}',
            "name": name,
            "description": f"Machine Type: {machineType}\n\nDescription:\n{nodeDesc}",
            "icon": icon,
            "solarwindsNodeId": nodeId
        }


for connection in connections:
    processNode(connection["SrcName"],
                connection["SrcNodeDesc"],
                connection["SrcMachineType"],
                connection["SrcNodeID"])
    processNode(connection["DestName"],
                connection["DestNodeDesc"],
                connection["DestMachineType"],
                connection["DestNodeID"])
    links.append({
        "source": f'Orion:{connection["SrcNodeID"]}',
        "target": f'Orion:{connection["DestNodeID"]}'
    })

for node in network_nodes:
    processNode(node["NodeName"], node["NodeDescription"],
                node["MachineType"], node["NodeID"])

with open("fullNetworkGraph.json", "w") as f:
    json.dump({"nodes": list(nodesById.values()), "links": links}, f)
