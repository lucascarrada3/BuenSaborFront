import axios from "axios";
import { Pedido } from '../../Types/Pedido';

export const getPedidos = async (idSucursal?: number, clienteId?: number, rol?: string): Promise<Pedido[]> => {
  try {
    let url = 'http://localhost:8080/pedido'; // URL base para obtener todos los pedidos

    // Si se pasa un idSucursal, se obtiene los pedidos de esa sucursal
    if (idSucursal) {
      url = `http://localhost:8080/pedido/sucursal/${idSucursal}`;
    }
    // Si se pasa un clienteId, se obtiene los pedidos de ese cliente
    else if (clienteId) {
      url = `http://localhost:8080/pedido/cliente/${clienteId}`;
    }
    // Si se pasa un rol, se obtiene los pedidos filtrados por rol
    else if (rol) {
      url = `http://localhost:8080/pedido/filtrado?rol=${rol}`;
    }
    
    // Realiza la llamada a la API
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    if (response.status !== 200) {
      throw new Error('Error al obtener los pedidos');
    }

    // Retorna los datos obtenidos
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error al obtener los pedidos:', error.response.data);
      throw new Error(error.response.data.error_message || 'Error al obtener los pedidos');
    } else {
      console.error('Error al obtener los pedidos:', error);
      throw error;
    }
  }
};

  
  export const getPedidoByClientId = async (clienteId?: number) => {
    console.log("entro a pedidoClienteID")
    console.log("id cliente", clienteId)
    try {
      const response = await axios.get(`http://localhost:8080/pedido/cliente/${clienteId}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      throw error;
    }
  }



