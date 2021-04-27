import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from "@angular/router";
import { notification, notificationType, User } from 'src/app/interfaces/User';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Livestream } from 'src/app/interfaces/livestream';



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

    }
    me: User;
    usersCollection: Map<string, User>;
    livestreamsCollection: Map<string, Livestream>

    getMyData(): User {
        return this.me;
    }
    getUser(uid: string): User {
        return this.usersCollection.get(uid);
    }
    getLivestream(lid: string): Livestream {
        return this.livestreamsCollection.get(lid);
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
        return this.afs.doc<User>(`livestreams/${lid}`).update(updatedData);
    }

    deleteLivestream(lid: string) {
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
}