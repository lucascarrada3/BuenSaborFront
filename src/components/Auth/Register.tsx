import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../CSS/Login.css';
import AuthClient from '../Services/Login';
import { LoginResponse } from '../../Types/LoginResponseDTO';

interface Cliente {
  nombre: string;
  email: string;
  apellido: string;
  telefono: string;
  clave: string; 
  direccion: string;
}

const RegisterCliente: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    clave: '',
    direccion: '',
  });
  

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const authClient = new AuthClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Enviando datos de cliente:", cliente); 
    
    try {
      // Llamada a AuthClient para registrar al cliente
      const response = await authClient.registerCliente(cliente);

      if (response && response.jwt) {
        setSuccess(true);
        setError(null);
      } else {
        setSuccess(false);
        setError(response.message || 'Error al registrar al cliente');
      }
    } catch (err) {
      setSuccess(false);
      setError('Error al registrar al cliente: ' + (err as any).message);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Registrar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={cliente.direccion}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Clave:</label>
          <input
            type="password"
            name="clave"
            value={cliente.clave}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button className="register-btn" type="submit">Registrar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Cliente registrado exitosamente.</p>}
    </div>
  );
};

export default RegisterCliente;
