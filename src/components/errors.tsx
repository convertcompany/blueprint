import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { TiWarningOutline } from "react-icons/ti";
import Button from "./button";

interface ErrorProps {
  title?: string;
  message?: string;
  path?: string | null;
  children?: React.ReactNode;
  buttonText?: string;
}
const ErrorView = (props: ErrorProps) => {
  const { title = "Ocorreu um erro!", message = "Algo deu errado...", path = "/", children, buttonText = "Voltar" } = props;
  return (
    <AnimatePresence>
      <div className="flex h-screen w-screen grow flex-col items-center justify-center bg-gray-50">
        <div className="fixed inset-0">
          <svg className="react-flow__background background h-full w-full opacity-80">
            <pattern id="pattern-1" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="translate(-1,-1)">
              <circle cx="1" cy="1" r="1" fill="#95a7b888"></circle>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-1)"></rect>
          </svg>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center">
          {children ? (
            children
          ) : (
            <div role="status">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-slate-800 shadow-lg shadow-amber-300/30">
                <TiWarningOutline size={32} />
              </div>
            </div>
          )}
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-slate-500">{message}</p>
          {path ? (
            <Link href={path}>
              <Button className="mt-6">{buttonText}</Button>
            </Link>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export { ErrorView };
