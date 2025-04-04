import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy] = useState('Title');
  const [descending] = useState(false);
  const [showToast, setShowToast] = useState(false); // state for controlling toast visibility
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useCart();

  // Fetch books when filters, page, or sort change
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          pageSize,
          pageNum,
          selectedCategories,
          sortBy,
          descending
        );

        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, selectedCategories, sortBy, descending]);

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500"> Error: {error}</p>;

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
        <Pagination
          currentPage={pageNum}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPageNum(1);
          }}
        />
      </div>
    </>
  );
}

export default BookList;
