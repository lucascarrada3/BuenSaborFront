import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthClient from '../Services/Login'; // Asegúrate de importar correctamente tu AuthClient
import '../CSS/Login.css';

interface LoginClienteProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>; // Estado para manejar la autenticación
}

const LoginCliente: React.FC<LoginClienteProps> = ({ setAuth }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authClient = new AuthClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await authClient.loginCliente({
        email: loginData.email,
        clave: loginData.password,
      });
  
      if (response.jwt) {
        localStorage.setItem('jwt', response.jwt); // Guardar JWT
        setAuth(true); // Cambiar estado de autenticación
        setError(null);
        navigate('/'); // Redirige al Home
      } else {
        setError(response.error || 'Error en el login. Verifica tus credenciales.');
      }
    } catch (err) {
      console.error('Error en el login:', err);
      setError('Error durante el login. Intenta de nuevo.');
    }
  };
  

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2>Login de Cliente</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-btn">
          Iniciar Sesión
        </button>
      </form>
      <button onClick={handleRegisterRedirect} className="register-btn">
        Registrar Cliente
      </button>
    </div>
  );
};

export default LoginCliente;
