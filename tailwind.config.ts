import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },

      // フォントファミリーを拡張し、「Poppins」というフォントをデフォルトのsansフォントとして追加
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      // カスタムのグリッドテンプレート列設定を追加
      gridTemplateColumns: {
        "70/30": "70% 28%", // 70%と30%（実際には28%）の2カラムレイアウトを定義
      },
    },
  },
  plugins: [],
};
export default config;
