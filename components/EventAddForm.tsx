"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { EventFormFields } from "@/types/eventFormFields";
import { ImageUploadResponse } from "@/types/imageUploadResponse";

const EventAddForm = () => {
  const [mounted, setMounted] = useState<boolean>(false); // コンポーネントがマウントされたかどうかを追跡するための状態
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Cloudinaryで提供された画像URLを保持するためのstate
  // フォームの各フィールドの初期値を設定
  const [fields, setFields] = useState<EventFormFields>({
    type: "",
    name: "",
    description: "",
    location: {
      venue: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    date_time: {
      start: "",
      end: "",
    },
    attendee_limits: {
      min: "",
      max: "",
    },
    ticket_info: {
      price: "",
    },
    conditions: [""],
    responsible_info: {
      name: "",
      email: "",
      phone: "",
    },
    images: [],
  });

  const [submitting, setSubmitting] = useState<boolean>(false); // 送信中の状態を管理

  // コンポーネントがマウントされた後に、mounted状態をtrueに設定
  useEffect(() => {
    setMounted(true);
  }, []);

  // フォームの入力値が変更されたときに呼び出される関数
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target; // e.target から name（入力フィールドの名前）と value（入力された値）を取得

    // フォームの name 属性がドット（.）を含む場合、ネストされたオブジェクトの更新が必要
    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split("."); // name をドットで分割して、外側と内側のキーを取得

      // 現在の fields 状態を取得し、更新する
      // setFieldsを使用して状態を更新。ここでは、prevFields（更新前の状態）を引数に取る。
      setFields((prevFields) => {
        // outerKeyをキーとして使用して、prevFieldsから対応するオブジェクトセクション（例: locationオブジェクト）を取得する。
        const outerSection = prevFields[outerKey as keyof EventFormFields];
        // 取得したセクションがオブジェクトであることを確認。
        if (typeof outerSection === "object" && outerSection !== null) {
          return {
            // 元の状態を展開して、特定のouterKeyの値のみを更新。
            ...prevFields,
            [outerKey]: {
              ...outerSection, // 取得したオブジェクトセクションを展開。
              [innerKey]: value, // innerKeyに該当するプロパティを新しいvalueで更新。
            },
          };
        }
        return prevFields; // セクションがオブジェクトでない場合は、状態を変更せずにそのまま返す。
      });
    } else {
      // ネストされていないプロパティの場合の処理（特にネストを考慮せずに、プロパティを更新すればいい。）
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  // 「応募要項」の追加または削除を処理する関数
  const handleConditionsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target; // e.targetから value と checked の値を抽出する。

    // 現在の「応募要項」配列をコピーして新しい配列を作成する。これにより、元の配列を直接変更することなく、新しい値を追加または削除できる。
    const updatedConditions = [...fields.conditions];

    if (checked) {
      // チェックボックスが選択された場合（checked が true の場合）、新しい「応募要項」を配列に追加する。
      updatedConditions.push(value);
    } else {
      // チェックボックスの選択が解除された場合（checked が false の場合）、該当する「応募要項」を配列から削除する。
      //indexOf() メソッドは、指定された要素を配列で探し、その要素が見つかればその位置のインデックス（0から始まる）を返します。要素が配列内に存在しない場合は -1 を返します。
      const index = updatedConditions.indexOf(value);

      if (index !== -1) {
        // 「応募要項」が配列内に存在する場合のみ、削除操作を行う
        updatedConditions.splice(index, 1);
      }
    }

    // 「応募要項」配列を更新した状態オブジェクトで、fieldsを更新する。
    setFields((prevFields) => ({
      ...prevFields, // 現在のフィールドの値
      conditions: updatedConditions, // 新しい「応募要項」配列で更新
    }));
  };

  // 画像の選択を処理する関数。
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target; // e.targetからファイルリストを取得

    if (files) {
      // 現在のイメージファイルの配列をコピーして新しい配列を作成
      const updatedImages = [...fields.images];

      // 取得したファイルリストをループ処理し、新しいイメージファイルを配列に追加。
      for (const file of files) {
        updatedImages.push(file);
      }

      // stateを更新して、新しい画像配列をセット
      setFields((prevFields) => ({
        ...prevFields,
        images: updatedImages,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // 画像ファイルが存在する場合、まず画像をアップロード
    if (fields.images.length > 0) {
      const formData = new FormData();
      fields.images.forEach((image) => formData.append("image", image));

      const imageResponse = await fetch("/api/events/image", {
        method: "POST",
        body: formData,
      });

      if (imageResponse.ok) {
        const imageData: ImageUploadResponse = await imageResponse.json();
        // 成功したら、画像URLを「imageUrls」stateに保存
        setImageUrls(imageData.map((img) => img.secure_url));
      } else {
        alert("画像のアップロードに失敗しました。");
        setSubmitting(false);
        return;
      }
    }

    // 画像アップロードに成功した後、その他のイベントデータを送信
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...fields, images: imageUrls }),
    });

    setSubmitting(false);

    if (response.ok) {
      alert("イベントが正常に登録されました。");
    } else {
      alert("イベントの登録に失敗しました。");
    }
  };

  return (
    // mountedがtrueの場合のみフォームをレンダリング
    mounted && (
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className="text-3xl text-center font-semibold mb-6">
          イベント登録
        </h2>

        <div className="mb-4 bg-sky-50 p-4">
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 font-bold mb-2"
            >
              タイプ
            </label>
            <select
              id="type"
              name="type"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.type}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="Outdoor">アウトドア</option>
              <option value="Lunch">ランチ</option>
              <option value="Maticon">街コン</option>
              <option value="Otakatu">オタ活</option>
              <option value="ThemePark">テーマパーク</option>
              <option value="Sport">スポーツ</option>
              <option value="Other">その他</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              イベント名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border rounded w-full py-2 px-3 mb-2"
              placeholder="イベント名を設定しましょう！"
              required
              value={fields.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              イベント詳細
            </label>
            <textarea
              id="description"
              name="description"
              className="border rounded w-full py-2 px-3"
              rows={4}
              placeholder="イベントの詳細説明を記載してみましょう！"
              value={fields.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="mb-4 bg-sky-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">場所</label>
          <input
            type="text"
            id="zipcode"
            name="location.zipcode"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="郵便番号"
            value={fields.location.zipcode}
            onChange={handleChange}
          />
          <input
            type="text"
            id="state"
            name="location.state"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="都道府県"
            required
            value={fields.location.state}
            onChange={handleChange}
          />
          <input
            type="text"
            id="city"
            name="location.city"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="市区町村"
            required
            value={fields.location.city}
            onChange={handleChange}
          />
          <input
            type="text"
            id="street"
            name="location.street"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="町名・番地等"
            value={fields.location.street}
            onChange={handleChange}
          />
          <input
            type="text"
            id="venue"
            name="location.venue"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="会場など"
            value={fields.location.venue}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4 bg-sky-50 p-4">
          <div className="mb-4">
            <label
              htmlFor="start"
              className="block text-gray-700 font-bold mb-2"
            >
              開始日時
            </label>
            <input
              type="datetime-local"
              id="start"
              name="date_time.start"
              className="border rounded w-full py-2 px-3"
              value={fields.date_time.start}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end" className="block text-gray-700 font-bold mb-2">
              終了日時
            </label>
            <input
              type="datetime-local"
              id="end"
              name="date_time.end"
              className="border rounded w-full py-2 px-3"
              value={fields.date_time.end}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap bg-sky-50 p-4">
          <div className="w-full mb-2">
            <label className="block text-gray-700 font-bold mb-2">
              募集人数
            </label>
          </div>
          <div className="w-full sm:w-1/3 pr-2">
            <label htmlFor="min" className="block text-gray-700 font-bold mb-2">
              Min
            </label>
            <input
              type="number"
              id="min"
              name="attendee_limits.min"
              className="border rounded w-full py-2 px-3"
              required
              min="0"
              value={fields.attendee_limits.min}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/3 px-2">
            <label htmlFor="max" className="block text-gray-700 font-bold mb-2">
              Max
            </label>
            <input
              type="number"
              id="max"
              name="attendee_limits.max"
              className="border rounded w-full py-2 px-3"
              required
              min="0"
              value={fields.attendee_limits.max}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4 bg-sky-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">応募要項</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <input
                type="checkbox"
                id="condition_anyAge"
                name="conditions"
                value="年齢不問"
                className="mr-2"
                checked={fields.conditions.includes("年齢不問")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_anyAge">年齢不問</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_womenWelcome"
                name="conditions"
                value="女性歓迎"
                className="mr-2"
                checked={fields.conditions.includes("女性歓迎")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_womenWelcome">女性歓迎</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_20sWelcome"
                name="conditions"
                value="20代歓迎"
                className="mr-2"
                checked={fields.conditions.includes("20代歓迎")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_20sWelcome">20代歓迎</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_studentsWelcome"
                name="conditions"
                value="学生歓迎"
                className="mr-2"
                checked={fields.conditions.includes("学生歓迎")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_studentsWelcome">学生歓迎</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_seniorsWelcome"
                name="conditions"
                value="シニア歓迎"
                className="mr-2"
                checked={fields.conditions.includes("シニア歓迎")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_seniorsWelcome">シニア歓迎</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_beginnersWelcome"
                name="conditions"
                value="初心者歓迎"
                className="mr-2"
                checked={fields.conditions.includes("初心者歓迎")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_beginnersWelcome">初心者歓迎</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_experiencePreferred"
                name="conditions"
                value="経験者優遇"
                className="mr-2"
                checked={fields.conditions.includes("経験者優遇")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_experiencePreferred">経験者優遇</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_childrenAllowed"
                name="conditions"
                value="子供同伴可"
                className="mr-2"
                checked={fields.conditions.includes("子供同伴可")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_childrenAllowed">子供同伴可</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_englishWelcome"
                name="conditions"
                value="英語が話せる方歓迎"
                className="mr-2"
                checked={fields.conditions.includes("英語が話せる方歓迎")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_englishWelcome">
                英語が話せる方歓迎
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_localResidentsOnly"
                name="conditions"
                value="地元住民限定"
                className="mr-2"
                checked={fields.conditions.includes("地元住民限定")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_localResidentsOnly">地元住民限定</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_volunteer"
                name="conditions"
                value="ボランティア"
                className="mr-2"
                checked={fields.conditions.includes("ボランティア")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_volunteer">ボランティア</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_singlePeopleOnly"
                name="conditions"
                value="独身の方限定"
                className="mr-2"
                checked={fields.conditions.includes("独身の方限定")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_singlePeopleOnly">独身の方限定</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_onlyCorporateOrganizations"
                name="conditions"
                value="企業団体のみの参加可"
                className="mr-2"
                checked={fields.conditions.includes("企業団体のみの参加可")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_onlyCorporateOrganizations">
                企業団体のみの参加可
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_petsAllowed"
                name="conditions"
                value="ペット同伴可"
                className="mr-2"
                checked={fields.conditions.includes("ペット同伴可")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_petsAllowed">ペット同伴可</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="condition_healthCertificateRequired"
                name="conditions"
                value="健康証明書が必要"
                className="mr-2"
                checked={fields.conditions.includes("健康証明書が必要")}
                onChange={handleConditionsChange}
              />
              <label htmlFor="condition_healthCertificateRequired">
                健康証明書が必要
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-sky-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">
            料金・予算 (該当しない場合は空白のままにしてください)
          </label>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="price" className="mr-2"></label>
              <input
                type="number"
                id="price"
                name="ticket_info.price"
                className="border rounded w-full py-2 px-3"
                min="0"
                value={fields.ticket_info.price}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 bg-sky-50 p-4">
          <div className="mb-4">
            <label
              htmlFor="owner_name"
              className="block text-gray-700 font-bold mb-2"
            >
              責任者名
            </label>
            <input
              type="text"
              id="owner_name"
              name="responsible_info.name"
              className="border rounded w-full py-2 px-3"
              placeholder="Name"
              value={fields.responsible_info.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="owner_email"
              className="block text-gray-700 font-bold mb-2"
            >
              責任者Email
            </label>
            <input
              type="email"
              id="owner_email"
              name="responsible_info.email"
              className="border rounded w-full py-2 px-3"
              placeholder="Email address"
              required
              value={fields.responsible_info.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="owner_phone"
              className="block text-gray-700 font-bold mb-2"
            >
              責任者電話番号
            </label>
            <input
              type="tel"
              id="owner_phone"
              name="responsible_info.phone"
              className="border rounded w-full py-2 px-3"
              placeholder="Phone"
              value={fields.responsible_info.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4 bg-sky-50 p-4">
          <label
            htmlFor="images"
            className="block text-gray-700 font-bold mb-2"
          >
            イメージ画像 (最大4つまでの画像をアップできます)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            className="border rounded w-full py-2 px-3"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
          />
        </div>

        <div>
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4"
            type="submit"
          >
            Add Event
          </button>
        </div>
      </form>
    )
  );
};
export default EventAddForm;
