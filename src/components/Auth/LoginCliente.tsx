import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginCliente: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clienteLogueado = await login(email, clave);
      setError('');
      navigate('/dashboard'); // Redirigir al dashboard después de login exitoso
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Aquí usamos el mensaje de error específico del backend
      } else {
        setError('Ocurrió un error inesperado durante el login.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-stripe top-stripe"></div>
      <div className="login-box">
        <h1 className="welcome-text">¡Bienvenido!</h1>
        <p className="welcome-subtext">Por favor, inicia sesión para continuar</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="clave">Contraseña:</label>
            <input
              type="password"
              id="clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
        <button onClick={() => navigate('/register')} className="register-button">
          Registrar
        </button>
      </div>
    </div>
  );
};

export default LoginCliente;