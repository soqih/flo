import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from "@angular/router";
import { User } from 'src/app/interfaces/User';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class DB {
    constructor(public afs: AngularFirestore, public router: Router) {
        
     }

    getMyData():User{
        return JSON.parse(localStorage.getItem('user'))
    }

    getUser(username: string): User{
        
        // String uid = user.getUid();
        // this.afs.collection<User>('users', ref => ref.where('username', '==', username).limit(1)).get().subscribe( (user) => {
        //     return user;
        // })
            let user: any;
            this.afs.collection('users').doc(username).ref.get().then(function (doc) {
              if (doc.exists) {
                  console.log("test")
                user = doc.data();
              } else {
                console.log("There is no document!");
              }
            }).catch(function (error) {
              console.log("There was an error getting your document:", error);
            });
            return user;
    //    this.afs.collection<User>('users', ref => ref.where('username', '==', 'mohammedkuz')).valueChanges({user : user})
    }
}

































    // user: firebase.User;

    // constructor(public auth: AngularFireAuth,public router:Router) {
    //     this.auth.authState.subscribe(user => {
    //         if (user){
    //           this.user = user;
    //           localStorage.setItem('user', JSON.stringify(this.user));
    //         } else {
    //           localStorage.setItem('user', null);
    //         }
    //       })
    // }
    // async login(email: string, password: string) {
    //     var result = await this.auth.signInWithEmailAndPassword(email, password)
    //     this.router.navigate(['admin/list']);
    // }
    // async register(email: string, password: string) {
    //     var result = await this.auth.createUserWithEmailAndPassword(email, password)
    //     this.sendEmailVerification();
    // }
    // async sendEmailVerification() {
    //     // await this.auth.currentUser.sendEmailVerification()
    //    await this.auth.currentUser.sendEmailVerification()

    //     this.router.navigate(['admin/verify-email']);
    // }
    // async sendPasswordResetEmail(passwordResetEmail: string) {
    //     return await this.auth.sendPasswordResetEmail(passwordResetEmail);
    //  }
    //  async logout(){
    //     await this.auth.signOut();
    //     localStorage.removeItem('user');
    //     this.router.navigate(['admin/login']);
    // }
    // get isLoggedIn(): boolean {
    //     const  user  =  JSON.parse(localStorage.getItem('user'));
    //     return  user  !==  null;
    // }
    // async  loginWithGoogle(){
    //     await  this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    //     this.router.navigate(['admin/list']);
    // }
    // login() {
    //     this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    //     // this.router.navigate(['home']);

    // }
    // logout() {
    //     this.auth.signOut();
    // }

