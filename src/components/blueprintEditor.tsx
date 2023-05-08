import { useState } from "react";
import "reactflow/dist/style.css";
import type { Edge, Node, ReactFlowInstance, ReactFlowJsonObject } from "reactflow";
import ReactFlow, { Background, ReactFlowProvider } from "reactflow";
import BlueprintEditorToolbar from "./blueprintEditorToolbar";
import { TextNode } from "./nodes/";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "text",
    data: { content: "Olá Mundo" },
    position: { x: 250, y: 5 },
    deletable: false,
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  text: TextNode,
};

const BlueprintEditor = ({ layout }: { layout?: ReactFlowJsonObject }) => {
  const [reactflowInstance, setReactflowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes] = useState<Node[]>();
  const [edges, setEdges] = useState<Edge[]>();
  console.log(reactflowInstance, setNodes, setEdges, layout); //So pra nao chorar o eslint
  return (
    <ReactFlowProvider>
      <ReactFlow nodes={nodes} edges={edges} defaultEdges={initialEdges} defaultNodes={initialNodes} onInit={setReactflowInstance} nodeTypes={nodeTypes} draggable={true}>
        <Background gap={24} color={"#95A7B888"} size={2} />
        <BlueprintEditorToolbar />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default BlueprintEditor;
