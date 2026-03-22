import { T } from "../../../components/styles";

export const ShopPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="shop-pagination">
      <button
        className={`page-btn${currentPage === 1 ? ' disabled' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >←</button>

      {start > 1 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span style={{ color: T.textDim, padding: '0 .25rem' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`page-btn${p === currentPage ? ' active' : ''}`}
          onClick={() => onPageChange(p)}
        >{p}</button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: T.textDim, padding: '0 .25rem' }}>…</span>}
          <button className="page-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        className={`page-btn${currentPage === totalPages ? ' disabled' : ''}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >→</button>
    </div>
  );
};

export default ShopPagination;