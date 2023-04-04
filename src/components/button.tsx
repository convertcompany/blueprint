import type { ReactNode } from "react";

const Button = ({ children }: { children: ReactNode | string }) => {
  return <button className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white antialiased hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">{children}</button>;
};

export default Button;
