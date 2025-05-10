// src/components/CategoryFilter.tsx
import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/products';

interface Props {
  onSelectCategory: (category: string | null) => void;
}

function CategoryFilter({ onSelectCategory }: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex gap-2 p-4 flex-wrap">
      <button
        onClick={() => onSelectCategory(null)}
        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300 capitalize"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;