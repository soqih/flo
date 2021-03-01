// import { Injectable, NgZone } from '@angular/core';
// import { User } from "../../interfaces/User";
// import firebase from 'firebase/app';
// import auth from 'firebase/app';
// import { AngularFireAuth } from "@angular/fire/auth";
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Router } from "@angular/router";

// @Injectable({
//     providedIn: 'root'
// })

// export class AuthService {
//     userData: User;
//     collection: AngularFirestoreCollection = this.afs.collection('users');
//     //  {
//     //   uid: "default",
//     //   email: "default",
//     //   username: "default",
//     //   displayName: "default",
//     //   photoURL: "default",
//     //   emailVerified: false,
//     //   birthdate: new Date(),
//     //   bio: "default",
//     // }; // Save logged in user data
//     // setUserData(){

//     // }
//     constructor(
//         public afs: AngularFirestore,   // Inject Firestore service
//         public afAuth: AngularFireAuth, // Inject Firebase auth service
//         public router: Router,
//         public ngZone: NgZone, // NgZone service to remove outside scope warning
//     ) {
//         /* Saving user data in localstorage when 
//         logged in and setting up null when logged out */
//         this.afAuth.authState.subscribe(user => {
//             if (user) {
//                 this.userData = user;
//                 localStorage.setItem('user', JSON.stringify(this.userData));
//                 JSON.parse(localStorage.getItem('user'));
//             } else {
//                 localStorage.setItem('user', null);
//                 JSON.parse(localStorage.getItem('user'));
//             }
//         })

//     }


//     // Sign in with email/password
//     SignIn(email, password) {
//         return this.afAuth.signInWithEmailAndPassword(email, password)
//             .then((result) => {
//                 this.ngZone.run(() => {
//                     this.router.navigate(['home']);
//                 });
//                 // this.SetUserData(result.user);
//             }).catch((error) => {
//                 window.alert(error.message)
//             })
//     }

//     // Sign up with email/password
//     SignUp(email, username, name, password) {
//         // console.log(email,)
//         return firebase.auth().createUserWithEmailAndPassword(email, password)
//             .then((result) => {
//                 this.createUserDoc(result.user)
//                 /* Call the SendVerificaitonMail() function when new user sign 
//                 up and returns promise */
//                 this.SendVerificationMail();
//                 // this.SetUserData(result.user, { email, username, name, password });
//                 // this.router.navigate(['home'])
//             }).catch((error) => {
//                 window.alert('iiiiiiiiiiiiii\n' + error.message)
//             })
//     }

//     // Send email verfificaiton when new user sign up
//     SendVerificationMail() {
//         return this.afAuth.currentUser.then(u => u.sendEmailVerification())
//             .then(() => {
//                 this.router.navigate(['verify-email-address']);
//             })
//     }

//     // Reset Forggot password
//     ForgotPassword(passwordResetEmail) {
//         return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
//             .then(() => {
//                 window.alert('Password reset email sent, check your inbox.');
//             }).catch((error) => {
//                 window.alert(error)
//             })
//     }

//     // Returns true when user is looged in and email is verified
//     get isLoggedIn(): boolean {
//         const user = JSON.parse(localStorage.getItem('user'));
//         return (user !== null && user.emailVerified !== false) ? true : false;
//     }

//     // Sign in with Google
//     // GoogleAuth() {
//     //   return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
//     // }

//     // Auth logic to run auth providers
//     // AuthLogin(provider) {
//     //   return this.afAuth.signInWithPopup(provider)
//     //     .then((result) => {
//     //       this.ngZone.run(() => {
//     //         this.router.navigate(['home']);
//     //       })
//     //       this.createUserDoc(result.user.uid)
//     //       this.SetUserData(result.user);
//     //     }).catch((error) => {
//     //       window.alert(error)
//     //     })
//     // }

//     /* Setting up user data when sign in with username/password, 
//     sign up with username/password and sign in with social auth  
//     provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
//     SetUserData(user: firebase.User, data?) {
//         const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
//         if (data) {
//             const userData: User = {
//                 uid: user.uid,
//                 email: user.email,
//                 displayName: user.displayName,
//                 photoURL: user.photoURL,
//                 emailVerified: user.emailVerified,
//                 username: data.username,
//                 birthdate: data.birthdate,
//                 bio: data.bio,
//             }
//             return userRef.set(userData,
//                 { merge: true }
//             )
//         } else {
//             const userData: User = {
//                 uid: user.uid,
//                 email: user.email,
//                 displayName: user.displayName,
//                 photoURL: user.photoURL,
//                 emailVerified: user.emailVerified,
//             }
//             return userRef.set(userData,
//                 { merge: true }
//             )
//         }


//     }
//     // setUsername() {

//     // }
//     // Sign out 
//     SignOut() {
//         return this.afAuth.signOut().then(() => {
//             localStorage.removeItem('user');
//             this.userData = null;
//             this.router.navigate(['']);
//         })
//     }
//     getUser() {
//         if (this.userData && this.userData.email)
//             return this.userData.email;
//         return "Welcome";
//     }

//     createUserDoc(user: firebase.User) {
//         // const user: AngularFirestoreDocument<User> =
//         this.collection.add(user);
//     }
// }