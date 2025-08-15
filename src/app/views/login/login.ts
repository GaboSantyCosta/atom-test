import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { FirebaseError } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalComponent } from '../../components/modal/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatInputModule,MatIconModule,MatButtonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  name: string | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: Dialog
  ){
    this.loginForm = this.initForm()
  }

  initForm(){
    return this.fb.group({
      user: [null,[Validators.required,Validators.email]],
      password: [null,[Validators.required]]
    });
  }

  async loginSubmit(){
    try {
      if(this.loginForm.valid) {
        await this.authService.signIn(this.loginForm.value.user,this.loginForm.value.password)
        this.router.navigateByUrl(`/`);
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        switch (error.message) {
          case 'auth/user-not-found':
            this.openDialog()
            break;
          case 'auth/wrong-password':
            this.openSnackBar('Wrong password');
            break;
          case 'auth/invalid-email':
            this.openSnackBar('Invalid email');
            break;
          default:
            this.openDialog()
            break;
        }
      } else {
        this.openSnackBar('Unedxpected error');
      }
    }
  }

  toogleShowPassword(){
    this.showPassword = !this.showPassword;
  }

  private openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      duration: 3000
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(ModalComponent, {
      width: '300px',
      data: {email: this.loginForm.value.user},
    });

    dialogRef.closed.subscribe(async(result) => {
      this.name = result;
      if(this.name) {
        await this.authService.createUserWithEmailAndPassword(this.loginForm.value.user,this.loginForm.value.password,this.name)
        this.router.navigateByUrl(`/`);
      }
    });
  }
}
