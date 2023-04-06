import type { SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { TbCheckbox, TbCode, TbHeading, TbList, TbListNumbers } from "react-icons/tb";

/* eslint-disable react/display-name */
export default forwardRef((props: { items : { label : string, command : ({}) => void, type : string }[], editor : SuggestionProps, range : SuggestionProps}, ref) => {
  const { editor, range } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props?.items[index];

    if (item) {
      item?.command({ editor, range });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items?.length - 1) % props.items?.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items?.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="items">
      {props.items?.length ? (
        props.items?.map((item: { label : string, type : string }, index:number) => (
          <button className={`item ${index === selectedIndex ? "is-selected" : ""}`} key={index} onClick={() => selectItem(index)}>
            <div className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 bg-slate-100 text-slate-400">{item?.type === "heading" ? <TbHeading /> : item?.type === "todo" ? <TbCheckbox /> : item?.type === "ordered" ? <TbListNumbers /> : item?.type === "unordered" ? <TbList /> : item?.type === "code" ? <TbCode /> : null}</div>
            {item?.label}
          </button>
        ))
      ) : (
        <div className="item">Nenhum comando encontrado...</div>
      )}
    </div>
  );
});
