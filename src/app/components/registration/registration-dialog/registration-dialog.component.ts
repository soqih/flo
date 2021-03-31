import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/interfaces/User';


@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnInit {
  user: User

  get correctSignUp() {
    if (!this.Name.value || !this.userName.value || !this.email.value || !this.password.value || !this.password2.value) {
      return false;

    }
    if (this.email.invalid || this.password.invalid || this.password2.invalid) {
      return false;
    }
    return true;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { type: string },
    public authService: AuthService) { }
  email = new FormControl('', [Validators.email]);
  userName = new FormControl('',[Validators.required]);
  Name = new FormControl('',[Validators.required]);

  password = new FormControl('', [Validators.minLength(6)]);
  isSignup: boolean = this.data.type == 'signup';
  ngOnInit(): void {

  }
  getErrorMessage() {
    return [this.email.hasError('email') ? 'Not a valid email' : '', this.password.hasError('minlength') ? 'Not a valid password' : ''];
  }
  signIn(username, password) {
    this.authService.SignIn(username, password);
  }
  signUp(email, username, name, password) {
    this.authService.SignUp({ email, username, name, password })

  }
  checkPasswordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors => {
    // console.log(this.password?.value, this.password2?.value)
    return this.password?.value != this.password2?.value ? { 'match': false } : null;
  }
  password2 = new FormControl('', [this.checkPasswordMatch]);

  // cpm:AbstractControlOptions = {
  //   validators:this.checkPasswordMatch,
  //   updateOn:'blur'
  // }

  checkMatch() {
    // console.log("bla")
    // this.checkPasswordMatch(null)

  }
  // checkPasswordMatch(a,b) {
  //   return a === b
  // }

}
