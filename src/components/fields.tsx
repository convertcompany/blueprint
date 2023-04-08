import type { ChangeEvent, KeyboardEvent } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  onEnter?: () => void;
  onKeyDown?: () => void;
  updateState?: (value: string) => void;
}
const Input = (props: InputProps) => {
  const { className, ...all } = props;
  const { onEnter, onKeyDown, label } = props;
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (onEnter) {
        onEnter();
      }
    }
    if (onKeyDown) {
      onKeyDown();
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event);
    } else if (props.updateState) {
      props.updateState(event.target.value);
    }
  };
  return (
    <div className={className}>
      {!!label && <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}</label>}
      <input className={` h-[38px] w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-400/20 dark:bg-gray-400/20 dark:focus:ring-sky-500`} onKeyDown={handleKeyDown} onChange={handleChange} {...all} />
    </div>
  );
};

export { Input };
