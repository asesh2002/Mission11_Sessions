import { useEffect, useState } from 'react';
import { Book } from '../types/Book';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState('Title');
  const [descending, setDescending] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/api/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, selectedCategories]);

  return (
    <>
      <h1>Book Store inventory</h1>
      <br />
      {books.map((b) => (
        <div id="bookCard" className="card" key={b.bookId}>
          <h3 className="card-title">{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>Author: {b.author}</li>
              <li>Publisher: {b.publisher}</li>
              <li>ISBN: {b.isbn}</li>
              <li>Classification: {b.classification}</li>
              <li>Category: {b.category}</li>
              <li>Page count: {b.pageCount}</li>
              <li>Price: ${b.price}</li>
            </ul>
          </div>
        </div>
      ))}
      {/* previous button */}
      <button disabled={pageNum == 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>
      {/* number button */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}
      {/* next button */}
      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>
      {/* results */}
      <br />
      <label>
        Results per page
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
      <br /> <br />
      {/* Sorting Toggle */}
      <button onClick={() => setDescending(!descending)}>
        {descending ? 'Sort A-Z' : 'Sort Z-A'}
      </button>
    </>
  );
}
export default BookList;
