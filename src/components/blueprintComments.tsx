"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import * as Y from "yjs";
/** Tiptap Extensions */
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";

import { useUser } from "@clerk/nextjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

const ydoc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: "ws://192.168.20.42:1234",
  document: ydoc,
  name: "user",
  forceSyncInterval: 200,
});

const BlueprintComments = () => {
  const user = useUser();
  const randomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Digite "/" para ver os comandos',
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user.user?.fullName,
          color: randomColor(),
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link,
    ],
    content: "<h1>Novo Projeto</h1>",
    editorProps: {
      attributes: {
        class: "prose w-full h-full focus:outline-none p-6 antialiased bg-slate-50/50",
      },
    },
  });

  return (
    <>
      <EditorContent editor={editor} className="blueprint-comments h-full" />
    </>
  );
};

export default BlueprintComments;
