import { FaBookmark } from "react-icons/fa"; // react-iconsライブラリからFaBookmarkアイコンをインポート
import { Event } from "../types/event";

// Propsの型を定義。
interface BookmarkButtonProps {
  event: Event;
}

//ブックマーク（お気に入り登録）できるボタンを提供するコンポーネントを定義
const BookmarkButton: React.FC<BookmarkButtonProps> = ({ event }) => {
  return (
    <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
      <FaBookmark className="mr-2" /> ブックマーク
    </button>
  );
};
export default BookmarkButton;
