import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo } from 'react';
import '../CSS/Login.css';
import AuthClient from '../Services/Login';
import { LoginResponse } from '../../Types/LoginResponseDTO';
import axios from 'axios';
import '../CSS/Register.css';

interface Cliente {
  nombre: string;
  email: string;
  apellido: string;
  telefono: string;
  clave: string;
  direccion: string;
  calle: string;
  numero: number;
  cp: number;
  piso: number;
  nroDpto: number;
  localidadId: number;
  provinciaId: number;
}

interface Provincia {
  id: number;
  nombre: string;
}

interface Localidad {
  id: number;
  nombre: string;
  provinciaId: number;
}

const RegisterCliente: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    clave: '',
    direccion: '',
    calle: '',
    numero: 0,
    cp: 0,
    piso: 0,
    nroDpto: 0,
    localidadId: 0,
    provinciaId: 0,
  });

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const authClient = new AuthClient();
  const stableLocalidades = useMemo(() => localidades, [localidades.length, ...localidades.map(l => l.id)]);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/provincia`);
        console.log('Response from /provincia:', response.data);
        if (Array.isArray(response.data)) {
          setProvincias(response.data);
        } else {
          console.error('Data from /provincia is not an array:', response.data);
          setProvincias([]);
        }
      } catch (error) {
        console.error('Error fetching provincia:', error);
        setProvincias([]);
      }
    };
    fetchProvincias();
  }, []);

  useEffect(() => {
    console.log('Effect for localidades triggered, provinciaId:', cliente.provinciaId);
    const fetchLocalidades = async () => {
        if (cliente.provinciaId) {
            try {
                const response = await axios.get(`http://localhost:8080/localidades/findByProvincia/${cliente.provinciaId}`);
                console.log('Localidades fetched:', response.data);
                setLocalidades(response.data);
            } catch (error) {
                console.error('Error al obtener las localidades:', error);
                setLocalidades([]);
            }
        } else {
            console.log('No provinciaId, setting localidades to empty');
            setLocalidades([]);
        }
    };

    fetchLocalidades();
}, [cliente.provinciaId]);


const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setCliente((prevState) => ({
      ...prevState,
      [name]: value,
  }));
}, []);

// For select inputs, if needed:
const handleSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setCliente((prevState) => ({
      ...prevState,
      [name]: value,
  }));
}, []);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    // Prepare cliente data
    const clienteData = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      email: cliente.email,
      clave: cliente.clave,
    };

    // Register the client first
    const registerResponse = await authClient.registerCliente(clienteData);
    console.log("Client registered successfully:", registerResponse);

    // Assuming the response from registerCliente includes a clientId or some identifier
    if (registerResponse && registerResponse.id) {
      // Prepare domicilio data
      const domicilioData = {
        clienteId: registerResponse.id, // Assuming the response includes an id
        calle: cliente.calle,
        numero: cliente.numero,
        cp: cliente.cp,
        piso: cliente.piso,
        nroDpto: cliente.nroDpto,
        localidadId: cliente.localidadId,
      };

      // Create the domicilio
      const domicilioResponse = await authClient.createDomicilio(domicilioData);
      console.log("Domicilio created successfully:", domicilioResponse);

      setSuccess(true);
      setError(null);
    } else {
      throw new Error('No client ID returned from registration');
    }
  } catch (error) {
    console.error('Error in registration process:', error);
    setError('Error al registrar el cliente');
    setSuccess(false);
  }
};

  return (
    <div className="register-container horizontal-form">
      <h2 className="title">Registro de Cliente</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Registro exitoso</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" value={cliente.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input type="text" id="apellido" name="apellido" value={cliente.apellido} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input type="text" id="telefono" name="telefono" value={cliente.telefono} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={cliente.email} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="clave">Clave</label>
            <input type="password" id="clave" name="clave" value={cliente.clave} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" id="direccion" name="direccion" value={cliente.direccion} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="calle">Calle</label>
            <input type="text" id="calle" name="calle" value={cliente.calle} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="numero">Número</label>
            <input type="number" id="numero" name="numero" value={cliente.numero} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cp">Código Postal</label>
            <input type="number" id="cp" name="cp" value={cliente.cp} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="piso">Piso</label>
            <input type="number" id="piso" name="piso" value={cliente.piso} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="nroDpto">Número de Departamento</label>
            <input type="number" id="nroDpto" name="nroDpto" value={cliente.nroDpto} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="provinciaId">Provincia</label>
            <select id="provinciaId" name="provinciaId" value={cliente.provinciaId} onChange={handleChange} required>
              <option value="">Seleccione una provincia</option>
              {provincias.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="localidadId">Localidad</label>
            <select id="localidadId" name="localidadId" value={cliente.localidadId} onChange={handleChange} required>
              <option value="">Seleccione una localidad</option>
              {stableLocalidades.map((localidad) => (
              <option key={localidad.id} value={localidad.id}>
                {localidad.nombre}
              </option>
            ))}
            </select>
          </div>
        </div>
        <button type="submit" className="submit-button">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterCliente;
