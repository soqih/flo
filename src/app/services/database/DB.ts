import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { ResolveEnd, Router } from "@angular/router";
import { User } from 'src/app/interfaces/User';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';


@Injectable({ providedIn: 'root' })
export class DB {
    constructor(public afs: AngularFirestore
        , public router: Router,
        public afAuth: AngularFireAuth,) {
        // this.searchByUsersname('')
        this.fetchCollection();
    }
    me: User;
    usersCollection: Map<string, User>;

    fetchCollection(): Promise<void>{
        return new Promise<void>((resolve, reject) => {
            if (this.usersCollection != null){
                // console.log("its not null")
                resolve()
            } else {
                // console.log("its null")
                this.afs.collection<User>('users')
                // .get()
                .valueChanges()
                .subscribe((d) => {
                    // console.log("data changed")
                    // this.usersCollection = new Map(d.docs.map(i => [i.data().uid, i.data()]));
                    this.usersCollection = new Map(d.map(i => [i.uid, i]));
                    // console.log(this.usersCollection)
                    resolve()
                })
            }
        })
    }

    getMyData(): User {
        return this.me;
    }
    
    async getUser(uid: string): Promise<User> {
        await this.fetchCollection();
        return new Promise<User>((resolve, reject) => {
            let u: User;
            if (this.usersCollection) u = this.usersCollection.get(uid)
            resolve(u)
        })
    }
    
    async getUser2(uid:string):Promise<User>{
     return new Promise<User>((resolve,reject)=>{
     this.afs.doc<User>(`users/${uid}`)
     .get()
     .subscribe((d)=>{
         resolve(d.data())
     })
 })
     }
    
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
    searchByUsersname(username: string) {
        console.log(this.usersCollection)
        this.afs.collection<User>('users').get().subscribe((d) => {
            d.docs.forEach((doc) => {
                doc.data().username.includes(username) ? console.log(doc.data().username) : ''
            })
        }
        )
    }
}