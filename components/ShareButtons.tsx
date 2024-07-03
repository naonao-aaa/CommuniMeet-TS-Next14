import { FaShare } from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from "react-share"; // react-shareライブラリから各ソーシャルメディア共有ボタンとアイコンをインポート
import { Event } from "../types/event";

// Propsの型を定義。
interface ShareButtonsProps {
  event: Event;
}

//イベントを共有するためのボタンを提供するコンポーネントを定義。
const ShareButtons: React.FC<ShareButtonsProps> = ({ event }) => {
  // 共有するURLを環境変数から取得し、イベントIDを付加
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/events/${event._id}`;

  return (
    <>
      <div className="max-w-md mx-auto mt-4 shadow-lg rounded-lg bg-pink-400">
        <div className="flex items-center justify-center text-white">
          <FaShare className="mr-2" />
          <h3 className="text-lg font-bold text-center pt-2">
            イベントをシェアしましょう！
          </h3>
        </div>
        <div className="flex gap-3 justify-center py-2">
          {/* Facebook共有ボタン */}
          <FacebookShareButton
            url={shareUrl} // 共有URL
            hashtag={`#${event.type.replace(/\s/g, "")}`}
          >
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>

          {/* Twitter共有ボタン */}
          <TwitterShareButton
            url={shareUrl} // 共有URL
            title={event.name} // ツイート内容のタイトル
            hashtags={[`${event.type.replace(/\s/g, "")}`]}
          >
            <TwitterIcon size={40} round={true} />
          </TwitterShareButton>

          {/* Email共有ボタン */}
          <EmailShareButton
            url={shareUrl} // 共有URL
            subject={event.name} // メールの件名
            body={`Check out this event listing: ${shareUrl}`} // メール本文
          >
            <EmailIcon size={40} round={true} />
          </EmailShareButton>
        </div>
      </div>
    </>
  );
};
export default ShareButtons;
