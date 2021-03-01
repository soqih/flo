import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from "@angular/router";
import { User } from 'src/app/interfaces/User';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class DB {
    constructor(public afs: AngularFirestore
        , public router: Router,
        public afAuth: AngularFireAuth,) {
            this.searchByUsersname('')
            this.afs.collection<User>('users')
            .valueChanges()
            // .get()
            .subscribe((d)=>{
                console.log("data changed")
                this.usersCollection=new Map(d.map(i => [i.uid, i]));
                console.log(this.usersCollection)
            })
    }
    me: User;
    usersCollection: Map<string, User>;

    getMyData(): User {
        return this.me;
    }
//    async getUser(uid:string):Promise<User>{
//     return new Promise<User>((resolve,reject)=>{
//     this.afs.doc<User>(`users/${uid}`)
//     .get()
//     .subscribe((d)=>{
//         resolve(d.data())
//     })
// })
//     }
getUser(uid:string) : Promise<User>{
       return new Promise<User>((resolve,reject)=>{
    
        resolve(this.usersCollection
            .get(uid),)
    })


//     if(this.usersCollection){
//         console.log(this.usersCollection.get(uid));
//     return this.usersCollection.get(uid);
// } else {
//     console.log("not found")
// }
}
    updateMyData(updatedData: object) {
        this.updateUser(this.me.uid, updatedData);
    }

    updateUser(uid: string, updatedData: object) {
        this.afs.doc<User>(`users/${uid}`).update(updatedData);
    }
    searchByUsersname(username:string){
        console.log(this.usersCollection)
        this.afs.collection<User>('users').get().subscribe((d)=>{
                d.docs.forEach((doc)=>{
                    doc.data().username.includes(username) ? console.log(doc.data().username) : ''
                })
            }
        )
    }
}