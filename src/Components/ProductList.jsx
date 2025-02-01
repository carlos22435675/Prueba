import React, { useState, useEffect, useRef } from 'react';

const ProductList = ({ products, onDelete, onEdit, onSort, sortConfig }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (productId, event) => {
    event.stopPropagation(); // Evita que otros eventos interfieran
    if (openMenuId === productId) {
      setOpenMenuId(null); // Cierra el menú si ya está abierto
    } else {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.left + window.scrollX,
      });
      setOpenMenuId(productId);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Usamos table-layout: fixed para mantener los anchos de las columnas fijos */}
      <table className="min-w-full table-fixed">
        <thead className="bg-gray-50">
          <tr>
            {/* Columna ID */}
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer w-[100px]" onClick={() => onSort('id')}>
              ID <span className="ml-1">{getSortIcon('id')}</span>
            </th>

            {/* Columna Name */}
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer w-[400px]" onClick={() => onSort('name')}>
              Name <span className="ml-1">{getSortIcon('name')}</span>
            </th>

            {/* Columna Category */}
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer w-[200px]" onClick={() => onSort('category')}>
              Category <span className="ml-1">{getSortIcon('category')}</span>
            </th>

            {/* Columna Actions (vacía) */}
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 w-[100px]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
              {/* Celda de ID */}
              <td className="py-4 px-6 text-sm text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {product.id}
              </td>

              {/* Celda de Name */}
              <td className="py-4 px-6 text-sm text-gray-700 break-words whitespace-normal max-w-[400px]">
                {product.name}
              </td>

              {/* Celda de Category */}
              <td className="py-4 px-6 text-sm text-gray-700 break-words whitespace-normal max-w-[200px]">
                {product.category}
              </td>

              {/* Celda de Actions */}
              <td className="py-4 px-6 text-sm text-gray-700">
                <div className="relative flex justify-end">
                  <button onClick={(e) => toggleMenu(product.id, e)} className="p-2 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {openMenuId === product.id && (
                    <div
                      ref={menuRef}
                      style={{ position: 'fixed', top: menuPosition.top, left: menuPosition.left }}
                      className="w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      <button
                        onClick={() => {
                          onEdit(product);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(product.id);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;