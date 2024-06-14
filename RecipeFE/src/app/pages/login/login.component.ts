import { Component } from '@angular/core';
import { Logindetails } from '../../interfaces/logindetails';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginDetails: Logindetails;
  form?: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {
    this.loginDetails = {
      email: '',
      password: '',
    };
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  login() {
    if (this.form?.valid) {
      this.loginDetails.email = this.form?.value.email;
      this.loginDetails.password = this.form?.value.password;

      this.auth.loginUser(this.loginDetails).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error: any) => {
          console.error('Inloggning misslyckades:', error)
        }
      });
    }
  }

  logout() {
    this.auth.logoutUser();
  }
}