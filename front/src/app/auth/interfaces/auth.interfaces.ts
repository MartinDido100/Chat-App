export interface AuthResponse{
    ok:boolean,
    username?: string,
    email?: string,
    token?: string,
    userId?: string,
    friends?: Usuario[],
}

export interface Usuario{
    username: string,
    email?:string,
    userId: string,
}