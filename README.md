# mcp-kubernetics

A Model Context Protocol (MCP) server that provides Kubernetes cluster introspection tools. It exposes various helper functions like listing pods, namespaces, node details, and more via MCP tools.

## Features

- List all pods in all namespaces
- List pods by namespace
- List all namespaces
- Describe a specific pod
- Get sorted events from a namespace
- Get node resource usage (CPU, Memory)
- Get node taints and labels

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mcp-kubernetics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```
   This will generate a `build` folder containing `index.js`.

## Usage

### Running with Claude AI

1. Open Claude desktop app.
2. Go to Settings.
3. Click on Developers.
4. Click on Edit Config.
5. This opens `claude_desktop_config.json`. Add the full path to the `index.js` file inside the `args` array as shown below.
6. Save the file.
7. Now you can ask questions related to your Kubernetes cluster like: "What are the pods in my cluster?"

### Example `claude_desktop_config.json` snippet

Replace `<FULL PATH OF BUILD>` with the absolute path to your built `index.js` file.

```json
{
  "mcpServers": {
    "kubernetics-mcp-server": {
      "command": "node",
      "args": ["<FULL PATH OF BUILD>/kubernetics-server/build/index.js"]
    }
  }
}
```

## Available Tools

- **get-kubernetics-namespaces**: Returns a list of namespaces in the cluster.
- **get-kubernetics-pods-detail-by-namespace**: Returns pod details filtered by namespace.
- **get-kubernetics-all-pods-detail**: Returns all pod details from the cluster.
- **describe-kubernetics-pod**: Describe a specific pod by name and namespace.
- **get-kubernetics-events**: Get sorted events from a namespace.
- **get-kubernetics-top-nodes**: Get CPU and memory usage for nodes.
- **get-kubernetics-node-details**: Get Kubernetes node taints and labels.

## Contributing

Contributions are welcome! Please open issues or pull requests.

## License

MIT License
