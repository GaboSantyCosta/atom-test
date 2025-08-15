import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterOutlet,MatToolbarModule,MatIconModule,MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public userService: UserService,
  ){}

  async logout(){
    await this.authService.signOut();
    await this.router.navigateByUrl(`/login`);
    this.openSnackBar('You are signed out');
  }

  private openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end'
    });
  }

}
