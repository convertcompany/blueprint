import type { ReactNode } from "react";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  children?: ReactNode | string;
}
const Button = (props: ButtonProps) => {
  const { children, className } = props;
  return (
    <button {...props} className={`inline-flex items-center rounded-[8px] bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white antialiased shadow-inner transition-all hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}>
      {children}
    </button>
  );
};

export default Button;
