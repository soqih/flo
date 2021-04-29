export interface Livestream {
    lid: string;
    title: string;
    likes: string[]; 
    dislikes: string[];
    date?: number;
    isActive: boolean;
    isPrivate: boolean;
    allowedFollowers?: string[];
    host: string;
    photoURL: string;
    videoURL?: string;
    currentViews: number;
    totalViews: string[]
}