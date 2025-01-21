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
import { useAuth } from '../Auth/AuthContext'; // Asegúrate de que la ruta es correcta

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth(); // Usa useAuth para obtener el estado de autenticación

  // No necesitas useEffect para isAuthenticated ya que useAuth maneja esto

  // Comprobar si estamos en la página de detalles del producto
  const isProductDetailsPage = location.pathname.startsWith('/product/');

  const handleProfileMenuOpen = () => {
    setDialogOpen(true);
  };

  const handleMenuClose = () => {
    setDialogOpen(false);
  };

  const handleLogout = () => {
    logout(); // Usa la función logout de AuthContext
    onLogout(); 
    window.location.href = '/'; 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Logo" style={{ height: '70px', marginRight: '10px' }} />
          Buen Sabor
        </a>
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