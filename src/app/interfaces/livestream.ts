export interface Livestream {
    lid: string;
    title: string;
    views: number;
    likes: any[]; // change it to string (uid)
    dislikes: any[]; // change it to string (uid)
    date?: number;
    isActive: boolean;
    isPrivate: boolean;
    allowedFollowers?: string[];
    saveStream: boolean;
    host: string;
    photoURL: string;
    videoURL?: string;
}