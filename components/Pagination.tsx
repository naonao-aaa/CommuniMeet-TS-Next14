// Propsの型を定義。
interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void; // コールバック関数の型を指定
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalItems,
  onPageChange,
}) => {
  // 全ページ数を計算。totalItems を pageSize で割ったものをceil関数で整数にする。(小数点以下を切り上げ)
  const totalPages = Math.ceil(totalItems / pageSize);

  // 新しいページに移動するための関数を定義。
  const handlePageChange = (newPage: number) => {
    // newPageがtotalPages範囲内なら onPageChange関数を呼び出す。
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <section className="container mx-auto flex justify-center items-center my-8">
      {/* 前へボタン */}
      <button
        className="mr-2 px-2 py-1 border border-gray-300 bg-slate-300 rounded"
        disabled={page === 1} //1ページ目では無効化する。
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
      {/* 現在のページと全ページ数を表示 */}
      <span className="mx-2">
        Page {page} of {totalPages}
      </span>
      {/* 次へボタン */}
      <button
        className="ml-2 px-2 py-1 border border-gray-300 bg-slate-300 rounded"
        disabled={page === totalPages} //最後のページでは無効化する。
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </section>
  );
};
export default Pagination;
