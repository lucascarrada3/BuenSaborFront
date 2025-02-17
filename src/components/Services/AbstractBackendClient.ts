// Clase abstracta que define métodos para operaciones CRUD en un servicio genérico
export abstract class AbstractBackendClient<T> {
    // Método abstracto para obtener un elemento por su ID
    abstract get(url: string, id: string ): Promise<T>;
  
    // Método abstracto para obtener todos los elementos
    abstract getAll(url: string ): Promise<T[]>;
  
    // Método abstracto para crear un nuevo elemento
    abstract post(url: string, data: T ): Promise<T>;
  
    // Método abstracto para actualizar un elemento existente por su ID
    abstract put(url: string, id: string, data: T ): Promise<T>;
  
    // Método abstracto para eliminar un elemento por su ID
    abstract delete(url: string, id: string ): Promise<void>;
  
    // Método abstracto para subir archivos
    abstract uploadFile(url: string, file: File, id: string ): Promise<Response>;
  
    //Método abstracto para eliminar imagen
    abstract deleteImage(url: string, publicId: string,  id: string ): Promise<Response>;
  
  }