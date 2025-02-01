import React, { useState } from 'react';

const AddProduct = ({ onAddProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && category) {
      onAddProduct({ name, category });
      setName('');
      setCategory('');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            placeholder="Enter product category"
            required
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;