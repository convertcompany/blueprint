import { TbArrowRight, TbArrowRightCircle, TbBriefcase, TbCircleSquare, TbComponents, TbLink, TbPhoto, TbPictureInPicture, TbPuzzle, TbShape, TbSquareRotated, TbTag, TbTextSize } from "react-icons/tb";

const BlueprintEditorToolbar = () => {
  return (
    <div className="absolute bottom-10 left-1/2 z-10 flex min-w-[400px] -translate-x-1/2 flex-row items-end gap-10 rounded-2xl border bg-white p-5 shadow-md">
      <Item icon={<TbTextSize size={32} strokeWidth={1.5} />} label="Texto" color="from-blue-600 to-blue-700 !text-blue-200 !ring-blue-500/20" />
      <Item icon={<TbShape size={32} strokeWidth={1.5} />} label="Forma" color="from-rose-500 to-rose-600 !text-rose-200 !ring-rose-500/20" />
      <Item icon={<TbTag size={32} strokeWidth={1.5} />} label="Badge" color="from-emerald-500 to-emerald-600 !text-emerald-200 !ring-emerald-500/20" />
      <Item icon={<TbPhoto size={32} strokeWidth={1.5} />} label="Imagem" color="from-indigo-500 to-indigo-600 !text-indigo-200 !ring-indigo-500/20" />
      <Item icon={<TbArrowRightCircle size={32} strokeWidth={1.5} />} label="Conexão" color="from-amber-300 to-amber-500 !text-amber-900 !ring-amber-500/20" />
      <Item icon={<TbBriefcase size={32} strokeWidth={1.5} />} label="Logo" color="from-sky-400 to-sky-500 !text-sky-200 !ring-sky-500/20" />
      <Item icon={<TbLink size={32} strokeWidth={1.5} />} label="Link" color="from-gray-600 to-gray-700 !text-gray-200 !ring-gray-500/20" />
      <Item icon={<TbComponents size={32} strokeWidth={1.5} />} label="Item" color="from-pink-500 to-pink-600 !text-pink-200 !ring-pink-500/20" />
    </div>
  );
};

interface ItemProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
}
const Item = (props: ItemProps) => {
  const { icon, label, color } = props;
  return (
    <div className="flex select-none flex-col items-center gap-4">
      <div draggable className={"grid h-10 w-10 place-items-center overflow-hidden  rounded-xl bg-gradient-to-b text-white ring-gray-900/20 ring-offset-2 transition-all hover:scale-110 hover:ring-2 " + color}>
        {icon}
      </div>
      {/* <span className="text-xs font-medium">{label}</span> */}
    </div>
  );
};

export default BlueprintEditorToolbar;
