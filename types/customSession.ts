import { Session } from "next-auth";

// Session オブジェクトに対する独自の拡張
export interface CustomSession extends Session {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}
