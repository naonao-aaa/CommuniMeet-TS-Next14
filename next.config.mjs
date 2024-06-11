/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // 使用するプロトコルを指定。
        hostname: "lh3.googleusercontent.com", // 許可する外部画像ホストのドメイン名。(Googleのユーザープロフィール画像をホストしているサーバー)
        pathname: "**", // パス名にワイルドカードを使用して、すべてのパスを含むことを指定。
      },
    ],
  },
};

export default nextConfig;
