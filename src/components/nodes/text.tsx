import { NodeResizer } from "reactflow";
import type { NodeProps } from "reactflow";

import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";

const TextNode = ({ selected, data }: NodeProps) => {
  const { content } = data as { content: string };
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose w-full h-full focus:outline-none antialiased p-1 cursor-text",
      },
    },
  });
  return (
    <div className={`flex flex-col ${!selected ? "select-none" : ""}`}>
      <NodeResizer minWidth={100} minHeight={30} isVisible={selected} color="#0022FF" handleStyle={{ width: 8, height: 8, borderRadius: 8 }} />
      <EditorContent editor={editor} className="blueprint-comments" />
    </div>
  );
};

export default TextNode;
