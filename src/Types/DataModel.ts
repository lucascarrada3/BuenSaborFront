/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface DataModel<T> {
    id: number;
    eliminado: boolean;
    [key: string]: T | number | undefined | any[] | string | boolean | any;
  }