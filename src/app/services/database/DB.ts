import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from "@angular/router";
import { User } from 'src/app/interfaces/User';
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

        // this.fetchCollection();
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

    // fetchCollection(): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         if (this.usersCollection != null) {
    //             // console.log("its not null")
    //             resolve()
    //         } else {
    //             // console.log("its null")
    //             this.afs.collection<User>('users')
    //                 // .get()
    //                 .valueChanges()
    //                 .subscribe((d) => {
    //                     // console.log("data changed")
    //                     // this.usersCollection = new Map(d.docs.map(i => [i.data().uid, i.data()]));
    //                     this.usersCollection = new Map(d.map(i => [i.uid, i]));
    //                     // console.log(this.usersCollection)
    //                     resolve()
    //                 })
    //         }
    //     })
    // }

    getMyData(): User {
        return this.me;
    }
    getUser(uid: string): User {
        return this.usersCollection.get(uid);
    }
    getLivestream(lid: string): Livestream {
        return this.livestreamsCollection.get(lid);
    }
    getUser2(uid: string): User {
        return this.usersCollection.get(uid);
    }

    // async getUser(uid: string): Promise<User> {
    //     await this.fetchCollection();
    //     return new Promise<User>((resolve, reject) => {
    //         let u: User;
    //         if (this.usersCollection) u = this.usersCollection.get(uid)
    //         resolve(u)
    //     })
    // }

    // async getUser2(uid: string): Promise<User> {
    //     return new Promise<User>((resolve, reject) => {
    //         this.afs.doc<User>(`users/${uid}`)
    //             .get()
    //             .subscribe((d) => {
    //                 resolve(d.data())
    //             })
    //     })
    // }

    // getUser(uid:string) : Promise<User>{
    //        return new Promise<User>((resolve,reject)=>{
    //         if (this.usersCollection)
    //         resolve(this.usersCollection
    //             .get(uid),)
    //     })
    // }

    //     if(this.usersCollection){
    //         console.log(this.usersCollection.get(uid));
    //     return this.usersCollection.get(uid);
    // } else {
    //     console.log("not found")
    // }
    // }
    updateMyData(updatedData: object) {
        this.updateUser(this.me.uid, updatedData);
    }

    updateUser(uid: string, updatedData: object) {
        this.afs.doc<User>(`users/${uid}`).update(updatedData);
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
    
    addToArray(arrayName:string,newElemnt:any){
        var obj ={}
        obj[arrayName] = firebase.firestore.FieldValue.arrayUnion(newElemnt)
        this.updateMyData(obj)
    }
    removeFromArray(arrayName:string,newElemnt:any){
        var obj ={}
        obj[arrayName] = firebase.firestore.FieldValue.arrayRemove(newElemnt)
        this.updateMyData(obj)
    }
    saveLivestream(livestream:Livestream){
        this.afs.collection('livestreams').add(livestream).then((l)=>{
            l.update({'lid':l.id})
            this.updateMyData({
                livestreams: firebase.firestore.FieldValue.arrayUnion(l.id)
            })
        })
    }
}