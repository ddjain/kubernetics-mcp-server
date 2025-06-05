import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {   getAllPods,
  getPodsByNamespace,
  getAllNamespaces,
  describePod,
  getSortedEvents,
  topNodes,
  getNodeDetails,} from './k8Helper.js';

// Create server instance
const server = new McpServer({
  name: "kubernetics-mcp-server",
  version: "1.0.1",
});

server.tool(
  "get-kubernetics-namespaces",
  "get kubernetics namespaces",
  {},
  async () => {
    let namespaces=await getAllNamespaces();
    const result = namespaces.join('\n');
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  },
);

server.tool(
  "get-kubernetics-pods-detail-by-namespace",
  "get pods details from kubernetics cluster by namespace",
  {
    namespace: z.string().describe("Name of the namespace in kubernetics cluster"),
  },
  async ({ namespace }) => {
    let pods=await getPodsByNamespace(namespace);
    const result = pods.join('\n');
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  },
);


server.tool(
  "get-kubernetics-all-pods-detail",
  "get all pods details from kubernetics cluster",
  {
    clusterName: z.string().describe("Name of the kubernetics cluster"),
  },
  async ({ clusterName }) => {
    let pods=await getAllPods();
    const result = pods.join('\n');
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  },
);


// Describe pod by name and namespace
server.tool(
  "describe-kubernetics-pod",
  "Describe pod details by name and namespace",
  {
    name: z.string().describe("Pod name"),
    namespace: z.string().describe("Namespace of the pod"),
  },
  async ({ name, namespace }) => {
    const details = await describePod(name, namespace);
    return {
      content: [
        {
          type: "text",
          text: details,
        },
      ],
    };
  },
);

// Get sorted events in a namespace
server.tool(
  "get-kubernetics-events",
  "Get sorted events in a Kubernetes namespace",
  {
    namespace: z.string().describe("Namespace to fetch events"),
  },
  async ({ namespace }) => {
    const events = await getSortedEvents(namespace);
    return {
      content: [
        {
          type: "text",
          text: events.join("\n"),
        },
      ],
    };
  },
);

// Get node CPU/Memory usage
server.tool(
  "get-kubernetics-top-nodes",
  "Get CPU and memory usage for nodes",
  {},
  async () => {
    const nodes = await topNodes();
    return {
      content: [
        {
          type: "text",
          text: nodes.join("\n"),
        },
      ],
    };
  },
);

// Get node taints and labels details
server.tool(
  "get-kubernetics-node-details",
  "Get Kubernetes node taints and labels",
  {},
  async () => {
    const nodeDetails = await getNodeDetails();
    return {
      content: [
        {
          type: "text",
          text: nodeDetails.join("\n"),
        },
      ],
    };
  },
);



// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Kubernetics MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
