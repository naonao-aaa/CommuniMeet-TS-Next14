/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // 使用するプロトコルを指定。
        hostname: "lh3.googleusercontent.com", // 許可する外部画像ホストのドメイン名。(Googleのユーザープロフィール画像をホストしているサーバー)
        pathname: "**", // パス名にワイルドカードを使用して、すべてのパスを含むことを指定。
      },
      {
        protocol: "https", // 使用するプロトコルを指定。
        hostname: "res.cloudinary.com", // 許可する外部画像ホストのドメイン名。(「Cloudinary」という、画像や動画を管理・最適化するためのクラウドベースのサービス)
        pathname: "**", // パス名にワイルドカードを使用して、すべてのパスを含むことを指定。
      },
    ],
  },
};

export default nextConfig;
