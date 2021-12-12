export interface AuthResponse{
    ok:boolean,
    username?: string,
    email?: string,
    token?: string,
    userId?: string,
    friends?: Usuario[],
    newMsgA: newMsg[]
}

export interface Usuario{
    username: string,
    email?:string,
    userId: string,
    friends?: Usuario[],
    newMsgA?: newMsg[]
}

interface newMsg{
    friend: string,
    numberOfMsgs: number,
    _id: string
}