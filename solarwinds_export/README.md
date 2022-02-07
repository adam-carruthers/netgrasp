# Solarwinds Link

To automatically generate a lot of your network from solarwinds, take the following steps:

1. Run the SWQL query in `orion_get_connected_nodes.swql` (for example in SWQL studio)

2. Save the results as `orion_generated_connectivity.csv`

3. Run the SWQL query in `orion_full_node_list.swql`, you may have to modify the query so that you are sure it only selects network nodes. In NHSD this is done by `Category=1`, but this is likely to vary in other organisations.

4. Save the results in `orion_full_node_list.csv`

5. Run `python generate_full_graph.py` (run it from the same folder as the CSV file)

6. It will create `fullNetworkGraph.json`, which you can open on the website like any other file
