export interface User {
    uid: string;
    username?: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    followingUsers?:  Array<User>;
    followersUsers?:  Array<User>;
    blockingUsers?:  Array<User>;
    blockedFromUsers?:  Array<User>;
    birthdate?: Date;
    bio?: string;
    livestreams?: livestream[]
}

interface livestream {
    title: string;
    views: number;
    likes: number;
    dislikes: number;
    date?: Date;
    active: boolean;
}