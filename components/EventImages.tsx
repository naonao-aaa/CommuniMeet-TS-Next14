import Image from "next/image"; // Next.jsのImageコンポーネントをインポート

//propsの型定義
interface EventImagesProps {
  images: string[]; // imagesプロパティは文字列の配列
}

// EventImagesコンポーネントの定義。propsとしてimagesを受け取る
const EventImages: React.FC<EventImagesProps> = ({ images }) => {
  return (
    <section className="bg-emerald-50 p-4">
      <div className="container mx-auto">
        {/* 画像が1枚だけの場合の条件分岐 */}
        {images.length === 1 ? (
          <Image
            src={images[0]}
            alt=""
            className="object-cover h-[400px] mx-auto rounded-xl"
            width={1800}
            height={400}
            priority={true}
          />
        ) : (
          // 画像が複数ある場合は、グリッドレイアウトで表示
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`
                  ${
                    images.length === 3 && index === 2
                      ? "col-span-2"
                      : "col-span-1"
                  }
                `}
              >
                <Image
                  src={image}
                  alt=""
                  className="object-cover h-[400px] w-full rounded-xl"
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default EventImages;
