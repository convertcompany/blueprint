import type { CommandProps, Range } from "@tiptap/react";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import { SuggestionKeyDownProps, SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import CommandList from "./commandList";

export default {
  char: "/",
  items: ({ query }: SuggestionProps | any) => {
    return [
      {
        label: "Titulo 1",
        type: "heading",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
        },
      },
      {
        label: "Titulo 2",
        type: "heading",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
        },
      },
      {
        label: "Titulo 3",
        type: "heading",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
        },
      },
      {
        label: "Tarefas",
        type: "todo",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleTaskList();
        },
      },
      {
        label: "Lista Ordenada",
        type: "ordered",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleOrderedList();
        },
      },
      {
        label: "Lista Circular",
        type: "unordered",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleBulletList();
        },
      },
      {
        label: "Código",
        type: "code",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleCodeBlock();
        },
      },
    ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props: SuggestionOptions | any) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps | any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
