export interface notification {
    uid: string;
    isItLike: boolean;
    date: number;
    hasSeen:boolean;
    lid?:string;
}
export interface User {
    uid: string;
    username?: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    followingUsers: string[]; //users id
    followersUsers: string[];
    blockingUsers: string[];
    blockedFromUsers: string[];
    bio?: string;
    livestreams: string[]; //livestream id
    notifications: notification[];
}
