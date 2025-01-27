/* eslint-disable @typescript-eslint/no-explicit-any */
import Domicilio from "../../Types/Domicilio";
import { LoginDTO } from "../../Types/LoginDTO";
import { LoginResponse } from "../../Types/LoginResponseDTO";
import BackendClient from "./BackendClient";

export default class AuthClient extends BackendClient<any> {
  private baseUrl: string;

  constructor() {
    super();
    this.baseUrl = "http://localhost:8080"; // Ajustado para usar la raíz, ya que el endpoint de domicilios está en un nivel superior
  }

  async loginEmpleado(data: LoginDTO): Promise<LoginResponse> {
    try {
      const response = await this.post(`${this.baseUrl}/auth/login`, data);
      console.log("Login response:", response); // Log para depuración
      return response;
    } catch (error) {
      console.error("Error en loginEmpleado:", error);
      throw error;
    }
  }

  async registerEmpleado(data: any): Promise<LoginResponse> {
    return this.post(`${this.baseUrl}/auth/registerEmpleado`, data);
  }

  async loginCliente(data: LoginDTO): Promise<LoginResponse> {
    return this.post(`${this.baseUrl}/auth/loginCliente`, data);
  }

  async registerCliente(data: any): Promise<LoginResponse> {
    console.log(data);
    try {
      const response = await this.post(`${this.baseUrl}/auth/registerCliente`, data);
      console.log("Register cliente response:", response);
      return response;
    } catch (error) {
      console.error("Error en registerCliente:", error);
      throw error;
    }
  }

  async createDomicilio(data: any): Promise<Domicilio> {
    return this.post(`${this.baseUrl}/domicilios`, data);
  }

  async getDomiciliosByCliente(clienteId: number): Promise<Domicilio[]> {
    try {
      const response = await this.get(`${this.baseUrl}/domicilios/bycliente`, clienteId.toString());
      console.log("Domicilios response:", response);
      return response as Domicilio[];
    } catch (error) {
      console.error("Error fetching domicilios by cliente:", error);
      throw error;
    }
  }
}