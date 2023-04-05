import * as ToastPrimitive from "@radix-ui/react-toast";
import { useState } from "react";
interface ToastProps {}
const Toast = () => {
  const [open, setOpen] = useState(false);
  return (
    <ToastPrimitive.Provider swipeDirection={"right"}>
      <ToastPrimitive.Root open={open} onOpenChange={setOpen} className={"radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right radix-state-closed:animate-toast-hide radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease] fixed inset-x-4 bottom-4 z-50 w-auto rounded-lg bg-white shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:bg-gray-800 md:bottom-auto md:left-auto md:right-4 md:top-4 md:w-full md:max-w-sm"}>
        <div className="flex">
          <div className="flex w-0 flex-1 items-center py-4 pl-5">
            <div className="radix w-full">
              <ToastPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">Pull Request Review</ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                Someone requested your review on <span className="font-medium">repository/branch</span>
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col space-y-1 px-3 py-2">
              <div className="flex h-0 flex-1">
                <ToastPrimitive.Action
                  altText="view now"
                  className="flex w-full items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-purple-600 hover:bg-gray-50 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:text-purple-500 dark:hover:bg-gray-900"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("https://github.com");
                  }}
                >
                  Review
                </ToastPrimitive.Action>
              </div>
              <div className="flex h-0 flex-1">
                <ToastPrimitive.Close className="flex w-full items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:text-gray-100 dark:hover:bg-gray-900">Dismiss</ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};
export default Toast;
