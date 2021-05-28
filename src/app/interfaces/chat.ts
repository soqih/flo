export interface Chat {
    id?:string;
    participant1UID:string;
    participant2UID:string;
    messages:Message[];
    p1LastSeenMessage:number;
    p2LastSeenMessage:number;
}
export interface Message {
    content:string;
    date:number;
    isP1Sender:boolean;
    
}