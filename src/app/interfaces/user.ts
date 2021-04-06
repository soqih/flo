class notification {
    uid: string;
    isItLike: boolean;
    date: Date;
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
