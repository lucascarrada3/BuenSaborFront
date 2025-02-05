import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import '../CSS/Login.css';
import AuthClient from '../Services/Login';
//import { LoginResponse } from '../../Types/LoginResponseDTO';
import axios from 'axios';
import '../CSS/Register.css';
import { Cliente } from '../../Types/Cliente';
import  IProvincia  from '../../Types/Provincia';
import  ILocalidad  from '../../Types/Localidad';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const RegisterCliente: React.FC = () => {
  const [mostrarClave, setMostrarClave] = useState(false);
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente>({
    id: 0,
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    clave: "",
    domicilios: [
      {
        id: 0,
        calle: "",
        numero: 0,
        cp: 0, 
        piso: 0, 
        nroDpto: 0, 
        localidad: {
          id: 0,
          nombre: "",
          provincia: {
            id: 0,
            nombre: "",
            eliminado: false,
            pais: {
              id: 0,
              nombre: "",
              eliminado: false,
            },
          },
        },
      },
    ],
  });

  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const authClient = new AuthClient();

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
    console.log('Effect for localidades triggered, provinciaId:', cliente.domicilios[0].localidad.provincia.id);
    const fetchLocalidades = async () => {
        if (cliente.domicilios[0].localidad.provincia.id) {
            try {
                const response = await axios.get(`http://localhost:8080/localidades/findByProvincia/${cliente.domicilios[0].localidad.provincia.id}`);
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
}, [cliente.domicilios[0].localidad.provincia.id]);


const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = event.target;
  setCliente((prevState) => ({
    ...prevState,
    nombre: name === 'nombre' ? value : prevState.nombre,
    apellido: name === 'apellido' ? value : prevState.apellido,
    telefono: name === 'telefono' ? value : prevState.telefono,
    email: name === 'email' ? value : prevState.email,
    clave: name === 'clave' ? value : prevState.clave,
    domicilios: [
      {
        ...prevState.domicilios[0],
        [name]: value
      }
    ]
  }));
};

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = event.target;
  if (name === 'provincia') {
    setCliente({
      ...cliente,
      domicilios: [
        {
          ...cliente.domicilios[0],
          calle: cliente.domicilios[0].calle,
          numero: cliente.domicilios[0].numero,
          cp: cliente.domicilios[0].cp,
          piso: cliente.domicilios[0].piso,
          nroDpto: cliente.domicilios[0].nroDpto,
          localidad: {
            ...cliente.domicilios[0].localidad,
            provincia: {
              ...cliente.domicilios[0].localidad.provincia,
              id: +value,
            },
          },
        },
      ],
    });
  } else if (name === 'localidad') {
    setCliente({
      ...cliente,
      domicilios: [
        {
          ...cliente.domicilios[0],
          localidad: {
            ...cliente.domicilios[0].localidad,
            id: +value,
          },
        },
      ],
    });
  } else {
    setCliente({ ...cliente, [name]: value });
  }
};

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
      domicilios: [
        {
          id: cliente.domicilios[0].id,
          calle: cliente.domicilios[0].calle,
          numero: cliente.domicilios[0].numero,
          cp: cliente.domicilios[0].cp, 
          piso: cliente.domicilios[0].piso, 
          nroDpto: cliente.domicilios[0].nroDpto, 
          localidad: {
            id: cliente.domicilios[0].localidad.id,
            nombre: cliente.domicilios[0].localidad.nombre,
            provincia: {
              id: cliente.domicilios[0].localidad.provincia.id,
              nombre: cliente.domicilios[0].localidad.provincia.nombre,
              eliminado: cliente.domicilios[0].localidad.provincia.eliminado,
              pais: {
                id: cliente.domicilios[0].localidad.provincia.pais.id,
                nombre: cliente.domicilios[0].localidad.provincia.pais.nombre,
                eliminado: cliente.domicilios[0].localidad.provincia.pais.eliminado,
              },
            },
          },
        },
      ],
    };

    // Register the client first
    const registerResponse = await authClient.registerCliente(clienteData);
    console.log("Client registered successfully:", registerResponse);

    // Assuming the response from registerCliente includes a clientId or some identifier
    // if (registerResponse && registerResponse.id) {
    //   // Prepare domicilio data
    //   const domicilioData = {
    //     clienteId: registerResponse.id, // Assuming the response includes an id
    //     calle: cliente.domicilios[0].calle,
    //     numero: cliente.domicilios[0].numero,
    //     cp: cliente.domicilios[0].cp,
    //     piso: cliente.domicilios[0].piso,
    //     nroDpto: cliente.domicilios[0].nroDpto,
    //     localidadId: cliente.domicilios[0].localidad.id,
    //   };

    //   // Create the domicilio
    //   const domicilioResponse = await authClient.createDomicilio(domicilioData);
    //   console.log("Domicilio created successfully:", domicilioResponse);

    //   setSuccess(true);
    //   setError(null);
    // } else {
    //   throw new Error('No client ID returned from registration');
    // }
  } catch (error) {
    console.error('Error in registration process:', error);
    setError('Error al registrar el cliente');
    setSuccess(false);
  }
};

return (
  <div className="register-container">
    <div className="register-stripe top-stripe"></div>
    <div className="register-box">
      <h1 className="welcome-text">¡Regístrate!</h1>
      <p className="welcome-subtext">Completa el formulario para crear tu cuenta</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Registro exitoso</div>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" value={cliente.nombre} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input type="text" id="apellido" name="apellido" value={cliente.apellido} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input type="text" id="telefono" name="telefono" value={cliente.telefono} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={cliente.email} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="clave">Contraseña</label>
          <div className="password-wrapper">
            <input type={mostrarClave ? "text" : "password"} id="clave" name="clave" value={cliente.clave} onChange={handleChange} required className="form-control" />
            <button type="button" className="show-password-button" onClick={() => setMostrarClave(!mostrarClave)} aria-label={mostrarClave ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {mostrarClave ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>

        <h2 className="section-title">Domicilio</h2>
        <div className="form-group">
          <label htmlFor="calle">Calle</label>
          <input type="text" id="calle" name="calle" value={cliente.domicilios[0].calle} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="numero">Número</label>
          <input type="number" id="numero" name="numero" value={cliente.domicilios[0].numero} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="cp">Código Postal</label>
          <input type="number" id="cp" name="cp" value={cliente.domicilios[0].cp} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="piso">Piso (opcional)</label>
          <input type="number" id="piso" name="piso" value={cliente.domicilios[0].piso ?? ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="nroDpto">Número de Departamento (opcional)</label>
          <input type="number" id="nroDpto" name="nroDpto" value={cliente.domicilios[0].nroDpto ?? ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="provincia">Provincia</label>
          <select id="provincia" name="provincia" value={cliente.domicilios[0].localidad.provincia.id} onChange={handleInputChange} required className="form-control">
            <option value="">Seleccione una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.id} value={provincia.id}>
                {provincia.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="localidad">Localidad</label>
          <select id="localidad" name="localidad" value={cliente.domicilios[0].localidad.id} onChange={handleInputChange} required className="form-control">
            <option value="">Seleccione una localidad</option>
            {localidades.map((localidad) => (
              <option key={localidad.id} value={localidad.id}>
                {localidad.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="login-button">Registrar</button>
      </form>

      <button onClick={() => navigate('/login')} className="register-button">Volver al Login</button>
    </div>
  </div>
);
};


export default RegisterCliente;
