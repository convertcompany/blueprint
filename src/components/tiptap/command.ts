import { Extension } from "@tiptap/core";
import type { SuggestionProps } from "@tiptap/suggestion";
import Suggestion from "@tiptap/suggestion";

export default Extension.create({
  name: "slash",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: SuggestionProps | any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
