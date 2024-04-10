import { Component } from '@angular/core';
import { Logindetails } from '../../interfaces/logindetails';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginDetails: Logindetails;

  constructor(private auth: AuthService) {
    this.loginDetails = {
      email: 'emi@emi.se',
      password: 'larre123',
    };
  }

  login(){
    this.auth.loginUser(this.loginDetails);
  }
  logout(){
    this.auth.logoutUser();
  }
}