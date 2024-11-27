import React, { useEffect, useState } from 'react';
import Pedido from '../../Types/Pedido'; // DTO de Pedido
import { getPedidos } from '../Services/pedidoService'; // Servicio para obtener los pedidos

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    getPedidos()
      .then((data) => setPedidos(data))
      .catch((error) => {
        console.error('Error al obtener los pedidos:', error);
      });
  }, []);

  return (
    <div>
      <h2>Mis Pedidos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha Pedido</th>
            <th>Producto</th>
            <th>Hora Estimada de Finalización</th>
            <th>Estado</th>
            <th>Forma de Pago</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
              <td>
                {pedido.detallePedidos.map((detalle, index) => (
                  <div key={index}>
                    {detalle.articulo.denominacion || 'Producto no disponible'}
                  </div>
                ))}
              </td>
              <td>{pedido.horaEstimadaFinalizacion}</td>
              <td>{pedido.estado}</td>
              <td>{pedido.formaPago}</td>
              <td>{pedido.totalCosto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MisPedidos;
