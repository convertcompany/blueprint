import { Extension } from "@tiptap/core";
import type { SuggestionProps } from "@tiptap/suggestion";
import Suggestion from "@tiptap/suggestion";

export default Extension.create({
  name: "slash",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: { props : { command : ({  }) => void }, editor : SuggestionProps, range : SuggestionProps}) => {
          props?.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      //eslint-disable-next-line @typescript-eslint/no-unsafe-argument 
      Suggestion({
        editor: this.editor,
        //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...this?.options?.suggestion,
      }),
    ];
  },
});
