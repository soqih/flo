export enum notificationType {
    LIKE = 'like',
    FOLLOW= "follow",
    INVITE = "invite"
}
export interface notification {
    uid: string;
    type:notificationType;
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
    pendingFollowers?:string[];
    bio?: string;
    livestreams: string[]; //livestream id
    notifications: notification[];
    isPrivate?:boolean;
}
