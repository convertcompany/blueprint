import * as ContextMenuRadix from "@radix-ui/react-context-menu";
import type { ReactNode } from "react";

export interface ContextMenuItem {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
}

export interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
}
const ContextMenu = (props: ContextMenuProps) => {
  const { children, items } = props;
  return (
    <ContextMenuRadix.Root>
      <ContextMenuRadix.Trigger tabIndex={-1}>{children}</ContextMenuRadix.Trigger>
      <ContextMenuRadix.Content className="z-10 w-48 rounded-xl bg-[#001122] px-1.5 py-1.5 antialiased shadow-md md:w-56">
        {items?.map((item, index) => (
          <ContextMenuRadix.Item className="flex cursor-default select-none items-center rounded-lg border border-transparent px-1.5 py-1.5 text-lg text-gray-500 outline-none focus:border-blue-500 focus:bg-blue-600 focus:text-white" onSelect={item.onSelect} key={index}>
            {item.icon}
            <span className="ml-2 text-sm font-medium text-white">{item.label}</span>
          </ContextMenuRadix.Item>
        ))}
      </ContextMenuRadix.Content>
    </ContextMenuRadix.Root>
  );
};

export default ContextMenu;
