interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  function setDescending(_arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex item-center justify-center mt-4">
      {/* Pagination Controls */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
      {/* Page Size Selector */}
      <br />
      <label>
        Results per page
        <select
          value={pageSize}
          onChange={(p) => {
            onPageSizeChange(Number(p.target.value));
            onPageChange(1); // reset to first page when page size changes
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
      <br /> <br />
      {/* Sorting Toggle */}
      <button onClick={() => setDescending(!true)}>
        {true ? 'Sort A-Z' : 'Sort Z-A'}
      </button>
    </div>
  );
};
export default Pagination;
