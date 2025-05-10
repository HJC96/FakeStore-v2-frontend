// src/pages/CartPage.tsx
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 장바구니</h1>

      {cart.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item.product.id}
              className="border p-4 rounded flex gap-4 items-center"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-20 h-20 object-contain"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.product.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.quantity}개</span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-blue-500 font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  ❌ 삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr className="my-6" />
      <div className="text-right font-bold text-lg">
        총 합계: ${total.toFixed(2)}
      </div>
    </div>
  );
}

export default CartPage;