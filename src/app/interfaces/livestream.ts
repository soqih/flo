export interface Livestream {
    lid:string;
    title: string;
    views: number;
    likes: number;
    dislikes: number;
    date?: Date;
    isActive: boolean;
    isPrivate: boolean;
    allowedFollowers?: string[];
    saveStream: boolean;
    host: string;
}