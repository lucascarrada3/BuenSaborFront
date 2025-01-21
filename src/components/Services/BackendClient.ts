import { AbstractBackendClient } from "./AbstractBackendClient";

export default abstract class BackendClient<T> extends AbstractBackendClient<T> {
  protected async request<T>(path: string, options: RequestInit): Promise<T> {
    try {
      // Realiza una solicitud fetch con la ruta y las opciones proporcionadas
      const response = await fetch(path, options);

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        console.log(response.statusText);
        // Si no es exitosa, lanza un error con el mensaje de estado de la respuesta
        throw new Error(response.statusText);
      }

      // Intenta obtener el cuerpo de la respuesta como texto
      const text = await response.text();
      // Si el texto está vacío, retorna un objeto vacío
      if (!text) return {} as T;

      // Intenta convertir el texto en JSON y retornarlo
      return JSON.parse(text);
    } catch (error) {
      // Si hay algún error, rechaza la promesa con el error
      return Promise.reject(error);
    }
  }

  protected async requestAll(path: string, options: RequestInit): Promise<T[]> {
    try {
      const response = await fetch(path, options);
      const text = await response.text();

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return text ? JSON.parse(text) : [];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async get(url: string, id: string): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
    };
    return this.request(path, options);
  }

  async getAll(url: string): Promise<T[]> {
    const path = url;
    const options: RequestInit = {
      method: "GET",
    };
    return this.requestAll(path, options);
  }

  async post(url: string, data: T): Promise<T> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return this.request(path, options);
  }

  async put(url: string, id: string, data: T): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  async delete(url: string, id: string): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    
    try {
      await this.request(path, options);
      console.log('Eliminación lógica realizada correctamente.');
    } catch (error) {
      console.error('Error al eliminar:', error);
      throw error;
    }
  }

  async uploadFile(url: string, file: File, id: string): Promise<Response> {
    const path = url;
    const formData = new FormData();
    formData.append('uploads', file);
    formData.append('id', id);

    const options: RequestInit = {
      method: "POST",
      body: formData,
    };

    return fetch(path, options);
  }
  async deleteImage(url: string,publicId: string, id: string): Promise<Response> {
    const encodedPublicId = encodeURIComponent(publicId);
    const encodedId = encodeURIComponent(id);
    const path = `${url}/deleteImg?publicId=${encodedPublicId}&id=${encodedId}`;
      const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ajusta según el tipo de contenido necesario por tu backend
      },
    };
    try {
      const response = await fetch(path, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      throw error; // O maneja el error según tus necesidades
    }
  }
  }