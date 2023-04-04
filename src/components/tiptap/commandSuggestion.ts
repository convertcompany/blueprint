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
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
        },
      },
      {
        label: "Titulo 2",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
        },
      },
      {
        label: "Titulo 3",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
        },
      },
      {
        label: "Tarefas",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleTaskList();
        },
      },
      {
        label: "Lista Ordenada",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleOrderedList();
        },
      },
      {
        label: "Lista Circular",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleBulletList();
        },
      },
      {
        label: "Código",
        command: ({ editor, range }: { editor: CommandProps; range: Range }) => {
          editor.commands.deleteRange(range);
          editor.commands.toggleCodeBlock();
        },
      },
    ];
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
