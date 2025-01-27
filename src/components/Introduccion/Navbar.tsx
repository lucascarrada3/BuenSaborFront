import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../Images/BuenSaborIcon2.png';
import {
  IconButton,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import { useAuth } from '../Auth/AuthContext';
import IDomicilio from '../../Types/Domicilio'; // Ensure this path is correct
import axios from 'axios';

interface NavbarProps {
  onLogout: () => void;
}

  interface ILocalidad {
    id: number;
    nombre: string;
  }

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [domicilios, setDomicilios] = useState<IDomicilio[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    return savedLocation !== null ? savedLocation : '';
  });
  const location = useLocation();
  const { isLoggedIn, logout, cliente } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoDomicilio, setNuevoDomicilio] = useState({
    direccion: '',
    calle: '',
    numero: '',
    cp: '',
    piso: '',
    nroDpto: '',
    provinciaId: '',
    localidadId: localidades[0]?.id || '',
  });
  interface IProvincia {
    id: number;
    nombre: string;
  }
  

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
    console.log('Effect for localidades triggered, provinciaId:', nuevoDomicilio.provinciaId);
    const fetchLocalidades = async () => {
      if (nuevoDomicilio.provinciaId) {
        try {
          const response = await axios.get(`http://localhost:8080/localidades/findByProvincia/${nuevoDomicilio.provinciaId}`);
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
  }, [nuevoDomicilio.provinciaId]);

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
          
          // Verifica si el domicilio seleccionado existe en la lista de domicilios
          const savedLocation = localStorage.getItem('selectedLocation');
          if (savedLocation && !data.some(d => d.id.toString() === savedLocation)) {
            localStorage.removeItem('selectedLocation');
            setSelectedLocation('');
          }
        } catch (error) {
          console.error('Error fetching domicilios:', error);
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
    setSelectedLocation(newLocation);
    localStorage.setItem('selectedLocation', newLocation);
    if (newLocation === 'nuevo') {
      setModalOpen(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNuevoDomicilio({ ...nuevoDomicilio, [name]: value });
  };

  const handleAddDomicilio = async () => {
    try {
      const response = await fetch("http://localhost:8080/domicilios", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoDomicilio)
      });
      if (!response.ok) {
        throw new Error('Error al añadir el domicilio');
      }
      const data: IDomicilio = await response.json();
      setDomicilios([...domicilios, data]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding domicilio:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
      <a className="navbar-brand" href="/">
      <img src={logo} alt="Logo" style={{ height: '70px', marginRight: '10px' }} />
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
              <option value="">Selecciona una ubicación</option>
              {domicilios.map(domicilio => (
                <option key={domicilio.id} value={domicilio.id.toString()}>
                  {`${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad?.nombre || 'Sin Localidad'}`}
                </option>
              ))}
              <option value="nuevo">Añadir domicilio nuevo</option>
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
                  onClick={() => (window.location.href = '/login')}
                >
                  Iniciar Sesión
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
      
       {/* Modal para añadir nuevo domicilio */}
       {modalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Añadir Domicilio Nuevo</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">              
                <div className="form-group">
                  <label htmlFor="calle">Calle</label>
                  <input type="text" id="calle" name="calle" value={nuevoDomicilio.calle} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="numero">Número</label>
                  <input type="number" id="numero" name="numero" value={nuevoDomicilio.numero} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cp">Código Postal</label>
                  <input type="number" id="cp" name="cp" value={nuevoDomicilio.cp} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="piso">Piso (opcional)</label>
                  <input type="number" id="piso" name="piso" value={nuevoDomicilio.piso} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="nroDpto">Número de Departamento (opcional)</label>
                  <input type="number" id="nroDpto" name="nroDpto" value={nuevoDomicilio.nroDpto} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="provinciaId">Provincia</label>
                  <select id="provinciaId" name="provinciaId" value={nuevoDomicilio.provinciaId} onChange={handleInputChange} required>
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
                  <select id="localidadId" name="localidadId" value={nuevoDomicilio.localidadId} onChange={handleInputChange} required>
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
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={handleAddDomicilio}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog para el menú de perfil */}
      <Dialog onClose={handleMenuClose} open={dialogOpen}>
        <DialogTitle>Perfil</DialogTitle>
        <List>
          <Divider />
          <ListItem
            component="li"
            onClick={() => (window.location.href = '/mis-pedidos')}
          >
            <ListItemIcon>
              <LunchDiningOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Mis Pedidos" />
          </ListItem>
          <ListItem component="li" onClick={handleLogout}>
            <ListItemIcon>
              <LunchDiningOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
      </Dialog>
    </nav>
  );
};

export default Navbar;