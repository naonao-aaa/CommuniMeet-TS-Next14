import Image from "next/image";

// EventHeaderImageProps 型定義
interface EventHeaderImageProps {
  image: string;
}

const EventHeaderImage: React.FC<EventHeaderImageProps> = ({ image }) => {
  return (
    <section>
      <div className="container-xl m-auto">
        <div className="grid grid-cols-1">
          <Image
            src={`/images/events/${image}`}
            alt=""
            className="object-cover h-[400px] w-full"
            width={0}
            height={0}
            sizes="100vw" // 画像がビューポートの全幅を使用する
            priority={true} // この画像をページの優先コンテンツとして扱い、プリロードする。ビューの初期部分に表示される重要な画像に対して特に有効。
          />
        </div>
      </div>
    </section>
  );
};
export default EventHeaderImage;
