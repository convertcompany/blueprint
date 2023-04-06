"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import * as Y from "yjs";
/** Tiptap Extensions */
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import suggestion from "./tiptap/commandSuggestion";

import { useUser } from "@clerk/nextjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

const ydoc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: "ws://localhost:1234",
  document: ydoc,
  name: "user",
  forceSyncInterval: 200,
});

const BlueprintComments = ({ value }: { value: JSON | null }) => {
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
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose w-full h-full focus:outline-none p-6 antialiased pt-2",
      },
    },
  });

  return (
    <>
      <EditorContent editor={editor} className="blueprint-comments grow" />
    </>
  );
};

export default BlueprintComments;
