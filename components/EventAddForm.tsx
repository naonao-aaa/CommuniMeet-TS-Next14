"use client";
import { useState, useEffect } from "react";
import { EventFormFields } from "@/types/eventFormFields";

const EventAddForm = () => {
  const [mounted, setMounted] = useState<boolean>(false); // コンポーネントがマウントされたかどうかを追跡するための状態
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

  // コンポーネントがマウントされた後に、mounted状態をtrueに設定
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = () => {};
  const handleEventsChange = () => {};
  const handleImageChange = () => {};

  return (
    // mountedがtrueの場合のみフォームをレンダリング
    mounted && (
      <form>
        <h2 className="text-3xl text-center font-semibold mb-6">
          イベント登録
        </h2>

        <div className="mb-4 bg-sky-50 p-4">
          <div className="mb-4">
            <label
              htmlFor="event_type"
              className="block text-gray-700 font-bold mb-2"
            >
              タイプ
            </label>
            <select
              id="event_type"
              name="event_type"
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
            placeholder="会場"
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
                onChange={handleEventsChange}
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
              name="responsible_info.name."
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
          />
        </div>

        <div>
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
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
