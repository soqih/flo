export interface User {
    uid: string;
    username?: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    followingUsers?:  Array<string>; //users id
    followersUsers?:  Array<string>;
    blockingUsers?:  Array<string>;
    blockedFromUsers?:  Array<string>;
    birthdate?: Date;
    bio?: string;
    livestreams: string[]; //livestream id
    numLivestreames: number;
}
