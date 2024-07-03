export interface EventFormFields {
  type: string;
  name: string;
  description: string;
  location: {
    venue: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  date_time: {
    start: string;
    end: string;
  };
  attendee_limits: {
    min: string; // フォームでの入力が文字列として扱われるため、ここでは string 型を使用
    max: string;
  };
  ticket_info: {
    price: string; // フォームでの入力が文字列として扱われるため、ここでは string 型を使用
  };
  conditions: string[]; // チェックボックスの選択肢を配列で管理
  responsible_info: {
    name: string;
    email: string;
    phone: string;
  };
  images: File[]; // ファイルのアップロードを扱うために File[] 型を使用
}
