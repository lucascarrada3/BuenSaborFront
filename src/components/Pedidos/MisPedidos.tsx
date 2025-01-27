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
  Box // Import Box for styling
} from '@mui/material';

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const { cliente } = useAuth(); // Obtener el cliente del contexto de autenticación
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  return (
    <Box sx={{ margin: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Mis Pedidos
      </Typography>
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
              <TableCell><b>Domicilio</b></TableCell>
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
                <TableCell>{pedido.horaEstimadaFinalizacion}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell>{pedido.formaPago}</TableCell> 
                <TableCell>{pedido.total}</TableCell>
                <TableCell>{pedido.domicilio?.calle || 'Retira en local'}</TableCell>
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
    </Box>
  );
};

export default MisPedidos;