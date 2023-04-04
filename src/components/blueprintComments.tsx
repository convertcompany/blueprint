"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const ydoc = new Y.Doc();
//eslint-disable-next-line
const provider = new WebrtcProvider("tiptap-collaboration-extension-convert", ydoc);

const BlueprintComments = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Digite / para ver os comandos",
      }),
      Collaboration.configure({
        document: ydoc,
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
