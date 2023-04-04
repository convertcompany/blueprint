"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useUser } from "@clerk/nextjs";

const ydoc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: "wss://blueprint-beta.vercel.app:1234",
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
        placeholder: "Digite / para ver os comandos",
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
    ],
    content: "<h1>Novo Projeto</h1>",
    editorProps: {
      attributes: {
        class: "prose w-full h-full focus:outline-none p-6 antialiased bg-gray-50/50",
      },
    },
  });

  return (
    <>
      <EditorContent editor={editor} className="blueprint-comments h-full" />;
    </>
  );
};

export default BlueprintComments;
