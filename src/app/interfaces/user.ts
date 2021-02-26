export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    username?: string;
    birthdate?: Date;
    bio?: string;
    livestreams?: livestream[]
}

interface livestream {
    title: string,
    views: number,
    likes: number,
    dislikes: number,
    date?: Date;
    active: boolean;
}