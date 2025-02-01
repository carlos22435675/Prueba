import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (values.email === 'user@example.com' && values.password === 'password') {
        login();
        navigate('/dashboard');
      } else {
        // Establece el error solo en el campo de contraseña
        formik.setErrors({ password: 'Incorrect email or password' });
      }
    },
  });

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/images/login.jpg')` }}
    >
      {/* Capa oscura semitransparente para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Formulario de login */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 bg-opacity-90 relative z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome</h2>
        {/* Añade noValidate al formulario para deshabilitar las validaciones del navegador */}
        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="flex items-center text-sm text-red-600 mt-2">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                {formik.errors.email}
              </div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {/* Muestra el mensaje de error solo para credenciales incorrectas */}
            {formik.errors.password && formik.submitCount > 0 ? (
              <div className="flex items-center text-sm text-red-600 mt-2">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;