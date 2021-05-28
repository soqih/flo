import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from "@angular/router";
import { notification, notificationType, User } from 'src/app/interfaces/User';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Livestream } from 'src/app/interfaces/livestream';
import { Chat, Message } from 'src/app/interfaces/chat';

@Injectable({ providedIn: 'root' })
export class DB {
    constructor(
        public afs: AngularFirestore,
        public router: Router,
        public afAuth: AngularFireAuth,
        public storage: AngularFireStorage,
    ) {
        this.afs.collection<User>('users')
            .valueChanges()
            .subscribe((d) => {
                this.usersCollection = new Map(d.map(i => [i.uid, i]));
            })

        this.afs.collection<Livestream>('livestreams')
            .valueChanges()
            .subscribe((d) => {
                this.livestreamsCollection = new Map(d.map(i => [i.lid, i]));
            })

        this.afs.collection<Chat>('chats')
            .valueChanges()
            .subscribe((d) => {
                this.chatsCollection = new Map(d.map(i => [i.id, i]));
            })

    }
    me: User;
    usersCollection: Map<string, User>;
    livestreamsCollection: Map<string, Livestream>
    chatsCollection: Map<string, Chat>

    getMyData(): User {
        return this.me;
    }
    getUser(uid: string): User {
        return this.usersCollection.get(uid);
    }
    getLivestream(lid: string): Livestream {
        return this.livestreamsCollection.get(lid);
    }
    getChat(cid: string): Chat {
        return this.chatsCollection.get(cid);
    }

    updateMyData(updatedData: object) {
        return this.updateUser(this.me.uid, updatedData);
    }

    updateUser(uid: string, updatedData: object) {
        return this.afs.doc<User>(`users/${uid}`).update(updatedData);
    }
    searchByUsersname(username: string): User[] { //return users that there username contains the parameter username
        var users: User[] = [];
        this.usersCollection.forEach((user) => {
            if (user.username.includes(username)) {
                users.push(user);
            }
        })
        return users;
    }

    addToArray(arrayName: string, newElemnt: any) {
        var obj = {}
        obj[arrayName] = firebase.firestore.FieldValue.arrayUnion(newElemnt)
        this.updateMyData(obj)
    }
    removeFromArray(arrayName: string, newElemnt: any) {
        var obj = {}
        obj[arrayName] = firebase.firestore.FieldValue.arrayRemove(newElemnt)
        this.updateMyData(obj)
    }
    saveLivestream(livestream: Livestream): Promise<string> {
        return new Promise<string>((resolve) => {
            this.afs.collection('livestreams').add(livestream).then((l) => {

                l.update({ 'lid': l.id })
                this.updateMyData({
                    livestreams: firebase.firestore.FieldValue.arrayUnion(l.id)
                }).then(() => { resolve(l.id) })
            })
        })
    }
    updateLivestream(lid: string, updatedData: object) {
        return this.afs.doc<Livestream>(`livestreams/${lid}`).update(updatedData);
    }

    deleteLivestream(lid: string, notUploaded?: boolean) {

        if (!notUploaded) {
            this.storage.storage.ref(`vid/vid${lid}`).delete();
        }

        this.afs.doc<User>(`livestreams/${lid}`).delete();
        this.updateMyData({
            livestreams: firebase.firestore.FieldValue.arrayRemove(lid)
        });
        this.updateMyData({ notifications: this.me.notifications.filter((n) => n.lid != lid) });
        this.me.followersUsers.forEach((follower) => {
            this.updateUser(follower, { notifications: this.getUser(follower).notifications.filter((n) => n.lid != lid) })
        })
    }
    myNotifications(): notification[] {
        return this.me.notifications;
    }
    myUnseenNotifications(): notification[] {
        return this.me?.notifications.filter((n) => !n.hasSeen)
    }
    sendNotification(receiver: string, sender: string, type: notificationType, lid?: string) {
        var notification: notification = {
            date: new Date().getTime(),
            uid: sender,
            type: type,
            hasSeen: false,
        }
        if (lid) {
            notification.lid = lid;
        }
        this.updateUser(receiver, { notifications: firebase.firestore.FieldValue.arrayUnion(notification) })
    }
    createChat(p2UID: string) {
        var cid = this.getChatIDByUid(p2UID);
        if(cid){
            this.router.navigate(['/messages/'+cid]);
            return;
        }
        var c: Chat = {
            participant1UID: this.me.uid,
            participant2UID: p2UID,
            messages: [],
            p1LastSeenMessage: 0,
            p2LastSeenMessage:0,
        }
        this.afs.collection<Chat>('chats').add(c).then((l) => {
            l.update({ 'id': l.id })
            this.updateMyData({
                chats: firebase.firestore.FieldValue.arrayUnion(l.id)
            })
            this.updateUser(p2UID, {
                chats: firebase.firestore.FieldValue.arrayUnion(l.id)
            })
            this.router.navigate(['/messages/'+l.id]);
        })
    }
    updateChat(cid: string, updatedData: object) {
        return this.afs.doc<Chat>(`chats/${cid}`).update(updatedData);
    }
    sendMessage(cid: string, content: string) {
        var m: Message = {
            content: content,
            date: new Date().getTime(),
            isP1Sender: this.getChat(cid).participant1UID === this.me.uid,
        }
        this.updateChat(cid, {
            messages: firebase.firestore.FieldValue.arrayUnion(m)
        })
    }
    getChatIDByUid(p2UID:string):string{
        var tempChat:Chat;
        var chatid = null;
        this.me?.chats?.forEach((cid)=>{
            tempChat = this.getChat(cid)
            if(tempChat.participant1UID === p2UID || tempChat.participant2UID === p2UID ){
                chatid =  cid;
            }
        })
        return chatid;
    }
    // this.me?.chats?.some((cid)=> this.getChat(cid).participant1UID === p2UID || this.getChat(cid).participant2UID === p2UID )
}