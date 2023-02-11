export interface Todo {
  id: string;
  created: string;
  text: string;
  completed: boolean;
}

enum TipoMovimiento {
  ABONO_CUENTA_COBRAR = "ABONO_CUENTA_COBRAR",
  CAPITAL_INICIAL = "CAPITAL_INICIAL",
  GASTO = "GASTO",
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
  MULTA = "Multa",
  VENTA_DE_ARTICULO = "Venta de artículo",
  DEUDA_PERIODO_ANTERIOR = "Deuda periodo anterior",
  OTRO = "Otro",
}

export enum EstatusCuentaCobrar {
  PENDIENTE = "Pendiente",
  PAGADO = "Pagado",
}

export interface Arbitro {
  id: number;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
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

export interface CategoriaData {
  id: string;
  nombre: string;
  precio: string;
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

export interface MovimientoGroup {
  [key: string]: Movimiento[];
}

export interface MovimientoResult {
  saldo: number;
  movimientos: MovimientoGroup;
}

export interface Movimiento {
  id: number;
  fecha: string;
  descripcion: string;
  monto: number;
  saldo: number;
  tipo: TipoMovimiento;
  activo: boolean;
}

export interface Juego {
  id: number;
  duracion: number;
  fecha: string;
  precio: number;
  estatus: EstatusJuego;
  estadio: Estadio;
  categoriaJuego: CategoriaJuego;
  arbitros: Arbitro[];
}

export interface JuegoCreateData {
  fecha: string;
  duracion: number;
  estadio: string;
  categoria: string;
  precio: number;
  arbitros: Arbitro[];
}

export interface GastoCreateData {
  monto: number;
  descripcion: string;
}

export interface JuegoEditData {
  id: string;
  duracion: number,
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

export interface CuentaCobrarArbitro {
  id: number;
  nombre: string;
  apellido: string;
  montoPagado: number;
  montoPendiente: number;
}

export interface AbonoCreateData {
  cuentaCobrarId: number;
  tipo: TipoCuentaCobrar;
  monto: number;
}

export interface CuentaCobrarCreateData {
  monto: number;
  descripcion: string;
  tipo: TipoCuentaCobrar;
  usuarioId: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  verifyNewPassword: string;
}

export const DuracionJuego = [
  { minutos: 60, text: "1 hora" },
  { minutos: 90, text: "1 hora con 30 minutos" },
  { minutos: 105, text: "1 hora con 45 minutos" },
  { minutos: 150, text: "2 horas con 30 minutos" },
  { minutos: 165, text: "2 horas con 45 minutos" },
  { minutos: 180, text: "3 horas" },
  { minutos: 210, text: "3 horas con 30 minutos" },
  { minutos: 225, text: "3 horas con 45 minutos" },
  { minutos: 240, text: "4 horas" },
];
