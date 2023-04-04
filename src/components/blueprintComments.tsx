"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { useEffect } from "react";

const BlueprintComments = () => {
  useEffect(() => {
    console.log("criando");
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider("blueprint-comments", ydoc);
    // provider.destroy();
    const type = ydoc.getText("comments");
    type.observe((event) => {
      console.log(event);
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Digite / para ver os comandos",
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
