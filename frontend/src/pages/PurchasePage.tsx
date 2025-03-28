import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

function DonatePage() {
  const navigate = useNavigate();
  const { title, bookId } = useParams();
  const { addToCart } = useCart();
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'no book',
      purchaseAmount,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase {title}</h2>

      <div>
        <input
          type="number"
          //   placeholder="Enter donation amount"
          value={purchaseAmount}
          onChange={(x) => setPurchaseAmount(Number(x.target.value))}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
      {/* takes you back to whatever the last page was */}
      <button onClick={() => navigate(-1)}>Go back</button>
    </>
  );
}

export default DonatePage;
