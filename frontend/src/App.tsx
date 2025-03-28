import './App.css';
import BookList from './components/BookList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BooksPage from './pages/BooksPage';
import PurchasePage from './pages/PurchasePage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            {/* home page */}
            <Route path="/" element={<BooksPage />} />
            <Route path="/books" element={<BooksPage />} />
            {/* donate page */}
            <Route
              path="/purchase/:bookName/:bookId"
              element={<PurchasePage />}
            />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
