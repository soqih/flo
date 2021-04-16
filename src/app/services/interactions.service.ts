import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { DB } from './database/DB';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  constructor(private db:DB, ) { }
  
  

}
