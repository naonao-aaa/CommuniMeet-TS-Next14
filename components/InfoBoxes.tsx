import React from "react";
import InfoBox from "./InfoBox";

const InfoBoxes: React.FC = () => {
  return (
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox
            heading="イベントを探しましょう！"
            backgroundColor="bg-gray-100"
            buttonInfo={{
              text: "Browse Events",
              link: "/events",
              backgroundColor: "bg-black",
            }}
          >
            楽しそうなイベントを探してみましょう！
          </InfoBox>
          <InfoBox
            heading="イベントを設定しましょう！"
            backgroundColor="bg-emerald-100"
            buttonInfo={{
              text: "Add Event",
              link: "/events/add",
              backgroundColor: "bg-emerald-500",
            }}
          >
            イベントを設定して、募集してみましょう！
          </InfoBox>
        </div>
      </div>
    </section>
  );
};
export default InfoBoxes;
