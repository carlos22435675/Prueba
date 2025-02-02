import React, { useState, useEffect, useCallback, useContext } from 'react';
import ProductList from './ProductList';
import AddProductModal from './AddProductModal';
import ConfirmationModal from './ConfirmationModal';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Importa los íconos necesarios
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext); // Obtén el estado de autenticación

  const [products, setProducts] = useState(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [
      { id: '1', name: 'Fabric softener', category: 'Hygiene', description: 'Softens fabrics and reduces static cling.' },
      { id: '2', name: 'Fabric soap', category: 'Hygiene', description: 'Cleans fabrics effectively and removes stains.' },
      { id: '3', name: 'Shampoo', category: 'Hygiene', description: 'Cleans and nourishes hair, leaving it shiny and healthy.' },
    ];
    return savedProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = useCallback(() => {
    return [...filteredProducts].sort((a, b) => {
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
  }, [filteredProducts, sortConfig]);

  const handleAddProduct = useCallback((newProduct) => {
    if (editingProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : product
        )
      );
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    } else {
      const productWithId = { ...newProduct, id: Date.now().toString() };
      setProducts((prevProducts) => [...prevProducts, productWithId]);
      toast.success('Product added successfully!');
    }
    setIsModalOpen(false);
  }, [editingProduct]);

  const handleDeleteProduct = useCallback((productId) => {
    setProductToDelete(productId);
    setIsConfirmationModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productToDelete));
    setIsConfirmationModalOpen(false);
    toast.success('Product deleted successfully!');
  }, [productToDelete]);

  const handleEditProduct = useCallback((product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const exportToCSV = useCallback(() => {
    const headers = ["ID", "Name", "Category", "Description"];
    const rows = products.map((product) => [
      product.id,
      product.name,
      product.category,
      product.description,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  }, [products]);

  return (
    <div className={`min-h-screen p-6 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-gray-100'}`}>
      <ToastContainer />
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product List</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`relative w-20 h-10 flex items-center rounded-full p-1 transition-colors ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-900'}`}
            >
              {theme === 'light' ? (
                <MoonIcon className="w-6 h-6 text-gray-700 absolute left-3" />
              ) : (
                <SunIcon className="w-6 h-6 text-yellow-500 absolute right-3" />
              )}
              <div
                className={`absolute w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform ${theme === 'light' ? 'translate-x-10' : 'translate-x-0'}`}
              >
                {theme === 'light' ? (
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-gray-900" />
                )}
              </div>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md mb-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white'}`}
        />

        <button
          onClick={exportToCSV}
          className={`px-4 py-2 ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-800'} text-white rounded-lg mb-4`}
        >
          Export to CSV
        </button>

        <ProductList
          products={sortedProducts()}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
          onSort={handleSort}
          sortConfig={sortConfig}
          className="bg-white text-gray-900"
        />

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onAddProduct={handleAddProduct}
          editingProduct={editingProduct}
          theme={theme}
        />

        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this product?"
        />
      </div>
    </div>
  );
};

export default Dashboard;
