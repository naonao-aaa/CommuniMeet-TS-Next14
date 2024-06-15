import { FaShare } from "react-icons/fa";
import { Event } from "../types/event";

// Propsの型を定義。
interface ShareButtonsProps {
  event: Event;
}

//イベントを共有するためのボタンを提供するコンポーネントを定義。
const ShareButtons: React.FC<ShareButtonsProps> = ({ event }) => {
  return (
    <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
      <FaShare className="mr-2" /> シェアする！
    </button>
  );
};
export default ShareButtons;
