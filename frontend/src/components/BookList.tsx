import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState('Title');
  const [descending, setDescending] = useState(false);
  const [showToast, setShowToast] = useState(false); // state for controlling toast visibility

  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch books when filters, page, or sort change
  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join('&');

      const finalUrl = `https://localhost:5000/api/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}&descending=${descending}${selectedCategories.length ? `&${categoryParams}` : ''}`;

      console.log('Fetching books with URL:', finalUrl);

      const response = await fetch(finalUrl);
      const data = await response.json();

      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, selectedCategories, sortBy, descending]);

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <h1>Book Store inventory</h1>
      <br />
      {/* Toast for "Book added to cart" */}
      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show bg-success text-white">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              />
            </div>
            <div className="toast-body">Book added to cart!</div>
          </div>
        </div>
      )}
      {/* Bootstrap grid layout for book cards */}
      <div className="container">
        <div className="row">
          {books.map((b) => (
            <div key={b.bookId} className="col-md-6 col-lg-4 mb-4">
              <div id="bookCard" className="card h-100">
                <h3 className="card-title p-3">{b.title}</h3>
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
                  {/* Purchase button also shows toast and navigates */}
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setShowToast(true); // show toast
                      setTimeout(() => {
                        navigate(`/purchase/${b.title}/${b.bookId}`, {
                          state: {
                            title: b.title,
                            price: b.price,
                          },
                        });
                      }, 500); // wait 500ms so the user sees the toast
                    }}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination Controls */}
      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
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
            setPageSize(Number(p.target.value));
            setPageNum(1); // reset to first page when page size changes
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
