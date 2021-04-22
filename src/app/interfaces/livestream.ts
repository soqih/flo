export interface Livestream {
    lid: string;
    title: string;
    views: string[];
    likes: string[]; 
    dislikes: string[];
    date?: number;
    isActive: boolean;
    isPrivate: boolean;
    allowedFollowers?: string[];
    saveStream: boolean;
    host: string;
    photoURL: string;
    videoURL?: string;
}