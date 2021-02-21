import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from  "@angular/router";

// export interface User {
//     uid: string;
//     email: string;
//     displayName: string;
//     photoURL: string;
//     emailVerified: boolean;
//  }

@Injectable({ providedIn: 'root' })
export class DB {
    constructor(public auth: AngularFireAuth,public router:Router) {}
    register(){
        firebase.auth().createUserWithEmailAndPassword('rr','123456');
        this.auth.createUserWithEmailAndPassword('rr','123456');
        // this.auth.
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

