import React, { useEffect, useState } from 'react';
import { Pedido } from '../../Types/Pedido'; // DTO de Pedido
import { getPedidoByClientId } from '../Services/pedidoService'; // Servicio para obtener los pedidos
import { useAuth } from '../Auth/AuthContext'; // Contexto de autenticación
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  Box,
  Modal // Add Modal for showing cart
} from '@mui/material';
import { Producto } from '../../Types/Producto'; // Assuming you have this type for cart items
import Cart from '../Carrito/Cart'; // Assume this path
import CartButton from '../Carrito/CartButtom'; // Assume this path
import '../CSS/carrito.css'; 

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const { cliente } = useAuth(); // Obtener el cliente del contexto de autenticación
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cart, setCart] = useState<Producto[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (cliente && cliente.id) {
        try {
          const data = await getPedidoByClientId(cliente.id);
          console.log('Pedidos:', data); // Registra para ver la estructura
          setPedidos(data);
        } catch (error) {
          console.error('Error al obtener los pedidos:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPedidos();
  }, [cliente]);

  // Functions for cart operations
  const onRemoveFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const onUpdateQuantity = (id: number, cantidad: number) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item
    ));
  };

  const toggleModal = () => setShowModal(!showModal);

  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (pedidos.length === 0) {
    return (
      <Box sx={{ margin: '20px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Mis Pedidos
        </Typography>
        <Typography variant="body1">
          No tienes pedidos.
        </Typography>
      </Box>
    );
  }

  const formatHoraEstimada = (horaEstimada: string) => {
    if (!horaEstimada) return 'Sin estimación';
  
    const timeParts = horaEstimada.split(':'); // Divide en partes HH:MM:SS
    const horas = parseInt(timeParts[0], 10);
    const minutos = parseInt(timeParts[1], 10);
  
    if (horas === 0) {
      return `${minutos} minutos`;
    } else {
      return `${horas} horas y ${minutos} minutos`;
    }
  };

  return (
    <Box sx={{ margin: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Mis Pedidos
      </Typography>
      {/* Cart Button */}
      <CartButton 
        cartLength={cart.length} 
        onClick={toggleModal} 
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#e3d8ba' }}>
            <TableRow>
              <TableCell><b>Fecha Pedido</b></TableCell>
              <TableCell><b>Producto</b></TableCell>
              <TableCell><b>Hora Estimada de Finalización</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell><b>Forma de Pago</b></TableCell>
              <TableCell><b>Total</b></TableCell>
              <TableCell><b>Tipo de envio</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pedido) => (
              <TableRow key={pedido.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {new Date(pedido.fechaPedido).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {pedido.detallePedidos.map((detalle: { articulo: { denominacion: any; }; }, index: React.Key | null | undefined) => (
                    <div key={index}>
                      {detalle.articulo.denominacion || 'Producto no disponible'}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{formatHoraEstimada(pedido.horaEstimadaFinalizacion)}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell>{pedido.formaPago}</TableCell> 
                <TableCell>{pedido.total}</TableCell>
                <TableCell>{pedido.tipoEnvio}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pedidos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
        {/* Modal for Cart */}
        <Modal
        open={showModal}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh', // Prevent modal from being too tall
          overflowY: 'auto' // Enable scrolling if content exceeds the height
        }}>
          <Cart 
            cart={cart} 
            onRemoveFromCart={onRemoveFromCart} 
            onUpdateQuantity={onUpdateQuantity} 
            onClose={toggleModal}
          />
        </Box>
      </Modal>
      </Box>
  );
};

export default MisPedidos;