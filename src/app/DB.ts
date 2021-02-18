import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class DB {
    constructor(public auth: AngularFireAuth) {

    }
    login() {
        this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
    logout() {
        this.auth.signOut();
    }

}