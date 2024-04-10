import { Component } from '@angular/core';
import { RegisterDetails } from '../../interfaces/registerdetails';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  RegisterDetails: RegisterDetails;

  constructor (private auth: AuthService) {
    this.RegisterDetails = {
      name: 'larre',
      email: 'larre@larre.se',
      password: 'larre123',
      password_confirmation:'larre123',
    };
  }
  registerUser() {
    this.auth.registerNewUser(this.RegisterDetails);
  }
}
