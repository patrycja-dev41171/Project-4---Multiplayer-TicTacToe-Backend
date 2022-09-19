export type User = {
    username: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
}

export interface UserEntity {
    id?:string;
    username: string;
    email: string;
    password: string;
}