import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser$: Observable<User | undefined> = new Observable<User | undefined>();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
      this.getUser();
  }

  getUser() {
    this.auth.getCurrentUser().subscribe({
      next: (user: User) => {
        console.log('User:', user);
        this.currentUser$ = of(user);
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });
  }
}
