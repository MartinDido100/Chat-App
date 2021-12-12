import { Usuario } from '../../auth/interfaces/auth.interfaces';
export interface ChatResponse {
    ok: boolean;
    msg?: string;
    mensajes: ChatMessage[];
    chatId?: string;
}

export interface ChatMessage {
    _id: string;
    contenido: string;
    conversacion: string;
    enviadoPor: string;
    recibidoPor: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserSearchResponse{
    ok: boolean;
    usuarios: Usuario[];
}

export interface AddMsgResponse{
    ok: boolean;
    msg: string;
    createdMsg: ChatMessage;
}

export interface NuevosMsg {
    nuevosMsg: number;
    friend: string;
}