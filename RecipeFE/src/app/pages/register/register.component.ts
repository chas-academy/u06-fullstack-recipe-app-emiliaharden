import { Component } from '@angular/core';
import { RegisterDetails } from '../../interfaces/registerdetails';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  RegisterDetails: RegisterDetails;
  form?: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {
    this.RegisterDetails = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    };
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ["", [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  registerUser() {
    // console.log('registerUser called');
    console.log(this.form);
    console.log(this.form?.valid);
    if (this.form?.valid) {
      console.log('Form is valid');
      this.RegisterDetails.name = this.form.value.name;
      this.RegisterDetails.email = this.form.value.email;
      this.RegisterDetails.password = this.form.value.password;
      this.RegisterDetails.password_confirmation = this.form.value.password_confirmation;

      this.auth.registerNewUser(this.RegisterDetails).subscribe({
        next: () => {
          console.log('Registration successful');
          this.auth.loginUser(this.RegisterDetails).subscribe({
            next: () => {
              console.log('Login after registration is successful');
              this.router.navigate(['/profile'])
            }
          })
        },
        error: (error) => {
          console.error('Registrering misslyckades', error);
        }
      });
    }
  }
}
