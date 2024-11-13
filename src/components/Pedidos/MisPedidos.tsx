import React, { useEffect, useState } from 'react';
import Pedido from '../../Types/Pedido'; // Suponiendo que Pedido es el DTO
import { getPedidos } from '../services/pedidoService'; // Suponiendo que tienes un servicio para obtener los pedidos

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    // Suponiendo que getPedidos es una función que hace una solicitud a tu API
    getPedidos().then((data) => {
      setPedidos(data);
    }).catch((error) => {
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
            <th>Hora Estimada de Finalización</th>
            <th>Estado</th>
            <th>Forma de Pago</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
              <td>{pedido.horaEstimadaFinalizacion}</td>
              <td>{pedido.estado}</td>
              <td>{pedido.formaPago}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MisPedidos;
