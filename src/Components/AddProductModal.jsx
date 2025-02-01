import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PlusCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const AddProductModal = ({ isOpen, onClose, onAddProduct, editingProduct }) => {
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    category: Yup.string().required('Category is required'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onAddProduct(values);
      formik.resetForm();
      onClose();
    },
  });

  // Efecto para cargar los datos del producto en edición
  useEffect(() => {
    if (editingProduct) {
      formik.setValues({
        name: editingProduct.name,
        category: editingProduct.category,
        description: editingProduct.description,
      });
    } else {
      formik.resetForm();
    }
  }, [editingProduct]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        {/* Botón de cerrar (X) en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-2">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        {/* Subtítulo debajo del título */}
        <p className="text-sm text-gray-600 mb-4">
          Please provide us with some information about the product.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter product name"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="" disabled>Select a category</option>
              {['Hygiene', 'Food', 'Electronics', 'Clothing', 'Other'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Write a description"
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
            ) : null}
          </div>
          <div className="flex justify-end space-x-4">
            {/* Botón de Cancelar en rojo */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              {editingProduct ? (
                <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;