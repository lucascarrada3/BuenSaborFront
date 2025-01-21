export interface LoginResponse {
    id: number;
    status: number;
    data: any;
    // cliente_id(arg0: string, cliente_id: any): unknown;
    message: string;
    jwt?: string;
    error?: string;
    //role: string;
  }