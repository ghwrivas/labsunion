export interface Todo {
  id: string;
  created: string;
  text: string;
  completed: boolean;
}

export enum Role {
  ARBITRO = "ARBITRO",
  COORDINADOR = "COORDINADOR",
  PRESIDENTE = "PRESIDENTE",
  TESORERO = "TESORERO",
  SECRETARIO = "SECRETARIO",
  ADMIN = "ADMIN",
}

export enum EstatusJuego {
  PROGRAMADO = "PROGRAMADO",
  REALIZADO = "REALIZADO",
  SUSPENDIDO = "SUSPENDIDO",
  REALIZADO_SIN_PAGO = "REALIZADO_SIN_PAGO",
}

export enum TipoCuentaCobrar {
  FINANZA_POR_JUEGO = "Finanza",
  VENTA_DE_ARTICULO = "VENTA_DE_ARTICULO",
  DEUDA_PERIODO_ANTERIOR = "DEUDA_PERIODO_ANTERIOR",
  OTRO = "OTRO",
}

export enum EstatusCuentaCobrar {
  PENDIENTE = "Pendiente",
  PAGADO = "Pagado",
}

export interface Arbitro {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  correo_electronico: string;
  role: Role;
  activo: boolean;
}

export interface ArbitroEditData {
  id: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  correo_electronico: string;
  role: string;
  activo: "true" | "false";
}

export interface EstadioData {
  id: string;
  nombre: string;
  activo: "true" | "false";
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

export interface JuegoCuentaCobrar {
  id: string;
  estatus: EstatusJuego;
  fecha: string;
  estadio: string;
  categoria: string;
}

export interface CuentaCobrar {
  id: number;
  monto: number;
  descripcion: string;
  tipo: TipoCuentaCobrar;
  estatus: EstatusCuentaCobrar;
  juego?: JuegoCuentaCobrar;
}

export interface AbonoCreateData {
  cuentaCobrarId: number;
  tipo: TipoCuentaCobrar;
  monto: number;
}
