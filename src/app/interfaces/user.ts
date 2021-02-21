export interface User {
    uid: string;
    email: string;
    username:string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    birthdate?: Date;
    bio?: string;
}