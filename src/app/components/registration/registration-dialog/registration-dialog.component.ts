import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';


@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnInit {
  user: User
  @ViewChild ('signin') signin : ElementRef;
  username: string;
  get correctSignUp() {
    if (!this.Name.value || !this.userName.value || !this.email.value || !this.password.value || !this.password2.value) {
      return false;

    }
    if (this.email.invalid || this.password.invalid || this.password2.invalid || this.userName.invalid) {
      return false;
    }
    return true;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { type: string },
    public authService: AuthService, private dialogRef: MatDialogRef<RegistrationDialogComponent>, public db:DB, ) { }
  email = new FormControl('', [Validators.email]);
  userName = new FormControl('',[Validators.required]);
  Name = new FormControl('',[Validators.required]);

  password = new FormControl('', [Validators.minLength(6)]);
  isSignup: boolean = this.data.type == 'signup';
  ngOnInit(): void {
    
  }
  closeDialog(){
    this.dialogRef.close();
  }
  getErrorMessage(type) {
    if(type === "email"){
      if(this.email.hasError('email') || this.email.hasError('required'))
        return 'Not a valid email';
      if(this.email.hasError('notUnique')) 
        return 'This email is used';
    }
    else{
      if(type ==="username"){
        if(this.userName.hasError('notUnique'))
          return 'This username is used';
        if(this.userName.hasError('required'))
          return 'Not a valid username';
      }
    }
    // return [this.email.hasError('email') ? 'Not a valid email' : '', this.email.hasError('notUnique') ? 'This email is used' : '',this.password.hasError('minlength') ? 'Not a valid password' : ''];
  }
  signIn(username, password) {
    this.authService.SignIn(username, password);
  }
  signUp(email, username, name, password) {
    this.authService.SignUp({ email, username, name, password })

  }
  checkPasswordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors => {
    return this.password?.value != this.password2?.value ? { 'match': false } : null;
  }
  password2 = new FormControl('', [this.checkPasswordMatch]);
  
  foundUsername(){
    if(!this.userName.value){
      this.userName.setErrors(null);
      return;
    }
   this.db.usersCollection.forEach((user) => {
    if(user.username === this.userName.value){
      this.userName.setErrors({
        notUnique: true
      });
      return;  
    }
   });
  }
  foundEmail(){
    if(this.email.value === ""){
      this.email.setErrors(null);
    }
    this.db.usersCollection.forEach((user) => {
      if(user.email === this.email.value){
        this.email.setErrors({
          notUnique: true
        });  
      }
     
     });
  }



  
  // checkPasswordMatch(a,b) {
  //   return a === b
  // }

}
