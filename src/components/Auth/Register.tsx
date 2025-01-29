import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo } from 'react';
import '../CSS/Login.css';
import AuthClient from '../Services/Login';
import { LoginResponse } from '../../Types/LoginResponseDTO';
import axios from 'axios';
import '../CSS/Register.css';
import { Cliente } from '../../Types/Cliente';
import  IProvincia  from '../../Types/Provincia';
import  ILocalidad  from '../../Types/Localidad';

const RegisterCliente: React.FC = () => {
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
        <label htmlFor="calle">Calle</label>
        <input type="text" id="calle" name="calle" value={cliente.domicilios[0].calle} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="numero">Número</label>
        <input type="number" id="numero" name="numero" value={cliente.domicilios[0].numero} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="cp">Código Postal</label>
        <input type="number" id="cp" name="cp" value={cliente.domicilios[0].cp} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="piso">Piso (opcional)</label>
        <input type="number" id="piso" name="piso" value={cliente.domicilios[0].piso ?? ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="nroDpto">Número de Departamento (opcional)</label>
        <input type="number" id="nroDpto" name="nroDpto" value={cliente.domicilios[0].nroDpto ?? ''} onChange={handleChange} />
      </div>
          <div className="form-group">
                  <label htmlFor="provincia">Provincia</label>
                  <select id="provincia" name="provincia" value={cliente.domicilios[0].localidad.provincia.id} onChange={handleInputChange} required>
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
                  <select id="localidad" name="localidad" value={cliente.domicilios[0].localidad.id} onChange={handleInputChange} required>
                    <option value="">Seleccione una localidad</option>
                    {localidades.map((localidad) => (
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
