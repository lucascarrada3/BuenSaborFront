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
    <div className="login-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      padding: '20px'
    }}>
      <form onSubmit={handleLogin} style={{
        maxWidth: '400px', 
        width: '100%', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px'
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="clave"
          label="Clave"
          type={mostrarClave ? 'text' : 'password'}
          autoComplete="current-password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setMostrarClave(!mostrarClave)}
                  edge="end"
                >
                  {mostrarClave ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button 
          type="submit"
          fullWidth 
          variant="contained" 
          color="primary" 
          style={{ marginTop: '20px' }}
        >
          Login
        </Button>
        {error && (
          <Alert severity="error" style={{ marginTop: '20px' }}>
            {error}
          </Alert>
        )}
        <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
          ¿No tienes una cuenta?{' '}
          <span 
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => navigate('/register')}
          >
            Regístrate aquí
          </span>
        </Typography>
      </form>
    </div>
  );
};

export default LoginCliente;