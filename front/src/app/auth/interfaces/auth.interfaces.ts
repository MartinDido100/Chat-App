export interface AuthResponse{
    ok:boolean,
    username?: string,
    email?: string,
    token?: string,
    userId?: string,
}

export interface Usuario{
    username: string,
    email?:string,
    userId: string,
}