import { useEffect, useState } from 'react';
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      // try catch block
      try {
        const response = await fetch(
          'https://localhost:5000/api/book/GetBookTypes'
        );
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    //inline if statement
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="category-filter">
      <h5>Book Categories</h5>

      {/* Collapse toggle for category help */}
      <button
        className="btn btn-outline-info mb-3"
        data-bs-toggle="collapse"
        data-bs-target="#categoryHelp"
      >
        What do these filters mean?
      </button>

      <div className="collapse" id="categoryHelp">
        <div className="card card-body">
          Select one or more categories to filter the books below. Unchecking
          removes that filter.
        </div>
      </div>

      <div className="category-list mt-3">
        {categories.map((c) => (
          <div key={c} className="category-item">
            <input
              type="checkbox"
              id={c}
              value={c}
              className="category-checkbox"
              onChange={handleCheckboxChange}
              checked={selectedCategories.includes(c)}
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CategoryFilter;
