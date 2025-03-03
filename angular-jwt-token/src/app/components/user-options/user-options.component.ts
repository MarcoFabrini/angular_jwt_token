import { Component, OnInit, viewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatAccordion } from '@angular/material/expansion';

interface User {
  fullName: string;
  email: string;
  role: Array<any>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-user-options',
  standalone: false,
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.scss',
})
export class UserOptionsComponent implements OnInit {
  currentUser: User | null = null;
  accordion = viewChild.required(MatAccordion);

  constructor(private api: AuthService) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.api.getAuthenticatedUser().subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        console.error('Failed to load user data', error);
      }
    );
  } // loadUser
} // class
