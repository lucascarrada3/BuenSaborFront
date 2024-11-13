import Pedido from '../../Types/Pedido';

export const getPedidos = async (idSucursal?: number, clienteId?: number, rol?: string): Promise<Pedido[]> => {
  try {
    let url = 'http://localhost:8080/pedido'; // URL base para obtener todos los pedidos

    // Si se pasa un idSucursal, se obtiene los pedidos de esa sucursal
    if (idSucursal) {
      url = `http://localhost:8080/pedido/sucursal/${idSucursal}`;
    }
    // Si se pasa un clienteId, se obtiene los pedidos de ese cliente
    else if (clienteId) {
      url = `http://localhost:8080//pedido/cliente/${clienteId}`;
    }
    // Si se pasa un rol, se obtiene los pedidos filtrados por rol
    else if (rol) {
      url = `http://localhost:8080/pedido/filtrado?rol=${rol}`;
    }
    
    // Realiza la llamada a la API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener los pedidos');
    }

    // Retorna los datos obtenidos
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw error;
  }
};
