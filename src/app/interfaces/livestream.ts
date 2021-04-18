export interface Livestream {
    lid: string;
    title: string;
    views: string[];
    likes: string[]; // change it to string (uid)
    dislikes: string[]; // change it to string (uid)
    date?: number;
    isActive: boolean;
    isPrivate: boolean;
    allowedFollowers?: string[];
    saveStream: boolean;
    host: string;
    photoURL: string;
    videoURL?: string;
}