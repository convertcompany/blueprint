import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { CgClose } from "react-icons/cg";

interface DialogProps {
  children?: React.ReactNode;
  open: boolean;
  openChange: (open: boolean) => void;
}
const Dialog = (props: DialogProps) => {
  const { open, openChange } = props;
  return (
    <>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Root open={open} onOpenChange={openChange}>
            <DialogPrimitive.Portal forceMount>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogPrimitive.Overlay forceMount className="fixed inset-0 z-20 bg-black/50" />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogPrimitive.Content forceMount className={"fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-md -translate-x-[50%] -translate-y-[50%] rounded-2xl bg-white p-6 focus:outline-none dark:bg-gray-700 md:w-full"}>
                  {props.children}
                  <DialogPrimitive.Close className={"absolute right-3.5 top-3.5 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring focus-visible:ring-blue-600"}>
                    <CgClose className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
                  </DialogPrimitive.Close>
                </DialogPrimitive.Content>
              </motion.div>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export { Dialog };
