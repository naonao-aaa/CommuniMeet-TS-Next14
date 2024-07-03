import EventSearchForm from "./EventSearchForm";

const Hero: React.FC = () => {
  return (
    <section className="bg-emerald-700 py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Find Event！
          </h1>
          <p className="my-4 text-xl text-white">
            条件検索でイベントを探してみましょう!
          </p>
        </div>
        {/* 検索フォーム */}
        <EventSearchForm />
      </div>
    </section>
  );
};

export default Hero;
