// src/components/Header.tsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">🛍️ Fakestore</Link>
      <Link to="/cart" className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        장바구니
      </Link>
    </header>
  );
}

export default Header;