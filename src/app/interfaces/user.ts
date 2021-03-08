export interface User {
    uid: string;
    username?: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    followingUsers?:  string[]; //users id
    followersUsers?:   string[];
    blockingUsers?:   string[];
    blockedFromUsers?:   string[];
    birthdate?: Date;
    bio?: string;
    livestreams: string[]; //livestream id
}
