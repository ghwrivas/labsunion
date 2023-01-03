export interface Todo {
  id: string;
  created: string;
  text: string;
  completed: boolean;
}

export enum EstatusJuego {
  PROGRAMADO = "PROGRAMADO",
  REALIZADO = "REALIZADO",
  SUSPENDIDO = "SUSPENDIDO",
  REALIZADO_SIN_PAGO = "REALIZADO_SIN_PAGO",
}

export interface Arbitro {
  id: number;
  nombre: string;
  apellido: string;
}

export interface Estadio {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CategoriaJuego {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
}

export interface Juego {
  id: number;
  hora: string;
  fecha: string;
  precio: number;
  estatus: EstatusJuego;
  estadio: Estadio;
  categoriaJuego: CategoriaJuego;
  arbitros: Arbitro[];
}

export interface JuegoCreateData {
  fecha: string;
  estadio: string;
  categoria: string;
  precio: number;
  arbitros: Arbitro[];
}

export interface JuegoEditData {
  id: string;
  fecha: string;
  estadio: string;
  estatus?: string;
  categoria: string;
  precio: number;
  arbitros: Arbitro[];
}