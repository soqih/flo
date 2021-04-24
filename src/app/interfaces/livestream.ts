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
    host: string;
    photoURL: string;
    videoURL?: string;
}