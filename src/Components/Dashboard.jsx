import React, { useState } from 'react';
import ProductList from './ProductList';
import AddProductModal from './AddProductModal';
import { PlusCircleIcon } from '@heroicons/react/24/solid'; // Nuevo ícono

const Dashboard = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Fabric softener', category: 'Hygiene', description: 'Softens fabrics and reduces static cling.', },
    { id: '2', name: 'Fabric soap', category: 'Hygiene', description: 'Cleans fabrics effectively and removes stains.', },
    { id: '3', name: 'Shampoo', category: 'Hygiene', description: 'Cleans and nourishes hair, leaving it shiny and healthy.', },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleAddProduct = (newProduct) => {
    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : product
        )
      );
      setEditingProduct(null);
    } else {
      const productWithId = { ...newProduct, id: Date.now().toString() };
      setProducts([...products, productWithId]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key) {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (sortConfig.key === 'id') {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product List</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" /> {/* Nuevo ícono */}
            Add Product
          </button>
        </div>
        <ProductList
          products={sortedProducts}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onAddProduct={handleAddProduct}
          editingProduct={editingProduct}
        />
      </div>
    </div>
  );
};

export default Dashboard;