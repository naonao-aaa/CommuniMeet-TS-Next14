"use client";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "100px auto",
};

// Propsの型定義
interface LoadingPageProps {
  loading: boolean; // loadingプロパティがboolean型であることを明示
}

const LoadingPage: React.FC<LoadingPageProps> = ({ loading }) => {
  return (
    <ClipLoader
      color="#3b82f6"
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
};
export default LoadingPage;
