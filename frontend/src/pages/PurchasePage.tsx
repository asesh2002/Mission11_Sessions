import { useNavigate, useParams, useLocation } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

function DonatePage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  // Pull passed data from state
  const passedTitle = location.state?.title ?? 'Unknown Book';
  const passedPrice = location.state?.price ?? 0;

  const [price, setPrice] = useState<number>(passedPrice);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: passedTitle,
      price: price,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase {passedTitle}</h2>

      <div>
        <h3>Price: ${price.toFixed(2)}</h3>
        <br/>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <button onClick={() => navigate(-1)}>Go back</button>
    </>
  );
}

export default DonatePage;