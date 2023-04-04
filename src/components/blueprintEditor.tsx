import { useState } from "react";
import type { Edge, Node, ReactFlowInstance, ReactFlowJsonObject } from "reactflow";
import ReactFlow, { Background, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const BlueprintEditor = ({ layout }: { layout?: ReactFlowJsonObject }) => {
  const [reactflowInstance, setReactflowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  return (
    <ReactFlowProvider>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background gap={24} color={"#95A7B888"} size={2} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default BlueprintEditor;
