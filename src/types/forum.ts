import { Timestamp } from 'firebase/firestore';

export interface Topic {
  id: string;
  titulo: string;
  descripcion: string;
  creador: string;
  creadorNombre: string;
  creadoEn: Timestamp;
  mensajesCount?: number;
}

export interface Message {
  id: string;
  contenido: string;
  autor: string;
  autorNombre: string;
  creadoEn: Timestamp;
}