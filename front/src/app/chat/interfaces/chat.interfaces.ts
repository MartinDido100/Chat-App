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
    usuarios: UserSearched[];
}

export interface UserSearched{
    _id: string,
    username: string;
}