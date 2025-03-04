import { Component, OnInit, viewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatAccordion } from '@angular/material/expansion';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-options',
  standalone: false,
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.scss',
})
export class UserOptionsComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  currentUser!: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.authService.getAuthenticatedUser().then(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        console.error('Failed to load user data', error);
      }
    );
  }
} // class
