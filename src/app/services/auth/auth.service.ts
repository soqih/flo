import { Injectable, NgZone, OnInit } from '@angular/core';
import { User } from "../../interfaces/User";
import firebase from 'firebase/app';
import auth from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { DB } from '../database/DB';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authUser: firebase.User; // Save logged in user data
  userSubscription: Subscription;
  isLoggedIn: boolean;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public db: DB,
  ) {

    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */

    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user'));
    //   } else {
    //     localStorage.setItem('user', null);
    //     JSON.parse(localStorage.getItem('user'));
    //   }
    // })

    this.afAuth.authState.subscribe(user => {

      if (user) {
        this.isLoggedIn = true;
        this.authUser = user;
        this.userSubscription = this.afs.doc<User>(`users/${user.uid}`).valueChanges().subscribe((user) => { this.db.me = user });
        localStorage.setItem('authUser', JSON.stringify(this.authUser));
      } else {
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
        this.isLoggedIn = false;
        this.authUser = null;

        this.db.me = null;
        localStorage.setItem('authUser', null);

      }
    })

  }



  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
      }).catch((error) => {
        window.alert(error.message)
      })
  }
  // Sign up with email/password
  SignUp(signUpFormData: { email: string, username: string, name: string, password: string }) {
    return this.afAuth.createUserWithEmailAndPassword(signUpFormData.email, signUpFormData.password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.createUser(result.user, signUpFormData);
        // this.router.navigate(['home'])
      }


      ).catch((error) => {
        window.alert(error.message)
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    // return this.afAuth.currentUser.then(u => u.sendEmailVerification())
    //   .then(() => {
    //     this.router.navigate(['verify-email-address']);
    //   })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is looged in and email is verified
  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   return user !== null
  //  && user.emailVerified !== false;
  // }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  createUser(user, signUpFormData) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: signUpFormData.name,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      username: signUpFormData.username,
    }
    return userRef.set(userData, {
      merge: true
    })
  }


  SetUserData(user, data?) { }

  get userD(): User {
    return this.authUser
  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      // this.ngZone.run(()=>{
      this.router.navigate(['']);
      // })
    })
  }
  getUser() {
    if (this.isLoggedIn && this.authUser) {
      return this.authUser.displayName;
    }
    // if (this.userData && this.userData.email)
    return "Welcome";

  }
}