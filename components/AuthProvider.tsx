"use client";
import { SessionProvider } from "next-auth/react"; // next-auth/reactからSessionProviderをインポート

// Propsの型定義
interface AuthProviderProps {
  children: React.ReactNode; // childrenの型定義。
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
export default AuthProvider;
