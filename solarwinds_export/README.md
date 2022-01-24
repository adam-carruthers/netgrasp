# Solarwinds Link

To automatically generate a lot of your network from solarwinds, take the following steps:

1. Run the SWQL query in `orion_get_connected_nodes.swql` (for example in SWQL studio)

2. Save the results as `orion_generated_connectivity.csv`

3. Run `python generate_full_graph.py` (run it from the same folder as the CSV file)

4. It will create `fullNetworkGraph.json`, which you can open on the website
