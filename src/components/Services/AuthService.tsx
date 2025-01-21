import axios from 'axios';
import { Cliente } from '../../Types/Cliente';

// const API_URL = import.meta.env.VITE_API_URL + '/auth';

export async function login(email: string, clave: string): Promise<Cliente> {
    try {
        const response = await axios.post(`/auth/loginCliente`, { email, clave });
        const token = response.data.jwt;

        localStorage.setItem('token', token);

        const clienteResponse = await axios.get(`/auth/currentCliente`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' // Corregido a CamelCase
            }
        });

        const clienteLogueado: Cliente = clienteResponse.data;
        localStorage.setItem('cliente', JSON.stringify(clienteLogueado));
        console.log('Response from login API:', response.data);
        console.log('Cliente Logueado: ', clienteLogueado);

        return clienteLogueado;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Aquí puedes manejar errores específicos basados en el status de la respuesta
            if (error.response.status === 401) {
                throw new Error('Email y/o Clave incorrectos, vuelva a intentar');
            } else {
                throw new Error('Ocurrió un error durante el login: ' + (error.response.data.error || 'Error desconocido'));
            }
        } else {
            console.error('Error en el servicio de login:', error);
            throw new Error('Ocurrió un error inesperado durante el login.');
        }
    }
}

export async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cliente');
    // Limpiar cualquier otro estado relacionado con la sesión aquí si es necesario
}