import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../Images/BuenSaborIcon2.png';
import {
  IconButton,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Divider,
  Button,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import { useAuth } from '../Auth/AuthContext';
import IDomicilio from '../../Types/Domicilio'; // Ensure this path is correct
import axios from 'axios';
import ILocalidad from '../../Types/Localidad'; // Ensure this path is correct
import  Provincia  from '../../Types/Provincia'; // Ensure this path is correct
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; 
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; 

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [domicilios, setDomicilios] = useState<IDomicilio[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    return savedLocation !== null ? savedLocation : '';
  });
  const location = useLocation();
  const { isLoggedIn, logout, cliente } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoDomicilio, setNuevoDomicilio] = useState({
    calle: '',
    numero: 0,
    cp: 0,
    piso: 0,
    nroDpto: 0,
    localidad: {
      id: '',
      nombre: '',
      provincia: {
        id: '',
        nombre: '',
          pais: {
            id: '',
            nombre: ''
          }
      }
    },
  });

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get('http://localhost:8080/provincia');
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
    console.log('Effect for localidades triggered, provinciaId:', nuevoDomicilio.localidad.provincia.id);
    const fetchLocalidades = async () => {
      if (nuevoDomicilio.localidad.provincia.id) {
        try {
          const response = await axios.get(`http://localhost:8080/localidades/findByProvincia/${nuevoDomicilio.localidad.provincia.id}`);
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
  }, [nuevoDomicilio.localidad.provincia.id]);

  useEffect(() => {
    const fetchDomicilios = async () => {
      if (cliente && cliente.id) {
        try {
          const response = await fetch(`http://localhost:8080/domicilios/bycliente/${cliente.id}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data: IDomicilio[] = await response.json();
          setDomicilios(data);
          setIsLoading(false); // Datos cargados, termina el estado de carga

          // Verifica si el domicilio seleccionado existe en la lista de domicilios
          const savedLocation = localStorage.getItem('selectedLocation');
          if (savedLocation && !data.some(d => d.id.toString() === savedLocation)) {
            localStorage.removeItem('selectedLocation');
            setSelectedLocation('');
          }
        } catch (error) {
          console.error('Error fetching domicilios:', error);
          setIsLoading(false);
        }
      }
    };

    fetchDomicilios();
  }, [cliente]);

  const isProductDetailsPage = location.pathname.startsWith('/product/');

  const handleProfileMenuOpen = () => {
    setDialogOpen(true);
  };

  const handleMenuClose = () => {
    setDialogOpen(false);
  };

  const handleLogout = () => {
    logout();
    onLogout();
    window.location.href = '/';
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocation = event.target.value;
    if (newLocation === 'nuevo') {
      setModalOpen(true);
    } else {
      setSelectedLocation(newLocation);
      localStorage.setItem('selectedLocation', newLocation);
    }
  };

  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'provincia') {
      setNuevoDomicilio({
        ...nuevoDomicilio,
        localidad: {
          ...nuevoDomicilio.localidad,
          provincia: {
            ...nuevoDomicilio.localidad.provincia,
            id: value
          }
        }
      });
    } else if (name === 'localidad') {
      setNuevoDomicilio({
        ...nuevoDomicilio,
        localidad: {
          ...nuevoDomicilio.localidad,
          id: value
        }
      });
    } else {
      setNuevoDomicilio({ ...nuevoDomicilio, [name]: value });
    }
  };

 const handleAddDomicilio = async () => {
  console.log('Adding domicilio:', nuevoDomicilio);
  try {
    if (!cliente || !cliente.id) {
      throw new Error('Cliente no definido o sin ID');
    }

    const clienteId = cliente.id;
    const response = await axios.put(
      `http://localhost:8080/auth/${clienteId}/domicilios`,
      [nuevoDomicilio],
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.getItem("token")
        }
      }
    );

    if (response.status !== 200) {
      throw new Error('Error al añadir el domicilio');
    }

    // Añadir el nuevo domicilio al estado y seleccionar automáticamente
    const nuevoDomicilioAñadido = response.data;
    setDomicilios(prevDomicilios => [...prevDomicilios, nuevoDomicilioAñadido]);
    setSelectedLocation(nuevoDomicilioAñadido.id); // Aquí se selecciona automáticamente el nuevo domicilio
    setModalOpen(false); // Cierra el modal
    window.location.reload();
  } catch (error) {
    console.error('Error al añadir domicilio:', error);
  }
};

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "70px", marginRight: "10px" }}
          />
          𝓑𝓾𝓮𝓷 𝓢𝓪𝓫𝓸𝓻
        </a>

        {isLoggedIn && (
          <div>
            <span className="me-4">Enviar a:</span>
            <select
              className="form-select"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <option key="default" value="">
                Selecciona una ubicación
              </option>
              {domicilios.map((domicilio) => (
                <option
                  key={domicilio.id || `domicilio-${Math.random()}`}
                  value={domicilio.id ? domicilio.id.toString() : ""}
                >
                  {`${domicilio.calle} ${domicilio.numero}, ${
                    domicilio.localidad?.nombre || "Sin Localidad"
                  }`}
                </option>
              ))}
              <option key="add-new" value="nuevo">
                Añadir domicilio nuevo
              </option>
            </select>
          </div>
        )}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/">
                INICIO
              </a>
            </li>
            {/* Solo mostrar "PRODUCTOS" si no estamos en la página de detalles */}
            {!isProductDetailsPage && (
              <li className="nav-item">
                <a className="nav-link" href="/productos">
                  PRODUCTOS
                </a>
              </li>
            )}
            {/* Verificar autenticación */}
            {isLoggedIn ? (
              // Ícono de perfil si está autenticado
              <li className="nav-item">
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </li>
            ) : (
              // Botón de iniciar sesión si no está autenticado
              <li className="nav-item">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => (window.location.href = "/login")}
                >
                  Iniciar Sesión
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Añadir Domicilio Nuevo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="calle">Calle</label>
                  <input
                    type="text"
                    id="calle"
                    name="calle"
                    value={nuevoDomicilio.calle}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="numero">Número</label>
                  <input
                    type="number"
                    id="numero"
                    name="numero"
                    value={nuevoDomicilio.numero}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cp">Código Postal</label>
                  <input
                    type="number"
                    id="cp"
                    name="cp"
                    value={nuevoDomicilio.cp}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="piso">Piso (opcional)</label>
                  <input
                    type="number"
                    id="piso"
                    name="piso"
                    value={nuevoDomicilio.piso}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nroDpto">
                    Número de Departamento (opcional)
                  </label>
                  <input
                    type="number"
                    id="nroDpto"
                    name="nroDpto"
                    value={nuevoDomicilio.nroDpto}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="provincia">Provincia</label>
                  <select
                    id="provincia"
                    name="provincia"
                    value={nuevoDomicilio.localidad.provincia.id}
                    onChange={handleInputChange}
                    required
                  >
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
                  <select
                    id="localidad"
                    name="localidad"
                    value={nuevoDomicilio.localidad.id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una localidad</option>
                    {localidades.map((localidad) => (
                      <option key={localidad.id} value={localidad.id}>
                        {localidad.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddDomicilio}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog para el menú de perfil */}
      <Dialog
        onClose={handleMenuClose}
        open={dialogOpen}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            height: "30vh",
          },
        }}
      >
        <DialogTitle
          style={{ textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}
        >
          Perfil
        </DialogTitle>
        <List>
          <Divider />
          <ListItem
            component="li"
            onClick={() => (window.location.href = "/mis-pedidos")}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartOutlinedIcon />}
              onClick={() => (window.location.href = "/mis-pedidos")}
              sx={{
                width: "100%",
                height: "50px",
                backgroundColor: "#e39553b0",
                marginBottom: "30px",
                marginRight: "20px",
                marginLeft: "20px",
                "&:hover": {
                  backgroundColor: "#d18c53", // Color más oscuro para el hover
                },
              }}
            >
              Mis Pedidos
            </Button>
          </ListItem>
          <ListItem component="li" onClick={handleLogout}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LogoutOutlinedIcon />}
              onClick={handleLogout}
              sx={{
                width: "100%",
                height: "50px",
                backgroundColor: "grey",
                marginRight: "20px",
                marginLeft: "20px",
                "&:hover": {
                  backgroundColor: "#5a6268", // Color más oscuro para el hover
                },
              }}
            >
              Cerrar Sesión
            </Button>
          </ListItem>
        </List>
      </Dialog>
    </nav>
  );
};

export default Navbar;