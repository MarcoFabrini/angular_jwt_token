import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  authService = inject(AuthService);
  router = inject(Router);

  errorMsg: string | null = null;
  isLoading: boolean = false;

  signupObj = {
    email: '',
    password: '',
    fullName: '',
  };

  onSignup() {
    this.isLoading = true;

    this.authService.signupUser(this.signupObj).subscribe({
      next: (response) => {
        if (response.id) {
          this.errorMsg = null;
          this.router.navigateByUrl('/login');
        } else {
          this.errorMsg = 'Signup failed. Please try again.';
        }
      },
      error: (error) => {
        this.errorMsg = error.error?.message || 'Signup failed';
      },
      complete: () => (this.isLoading = false),
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}// class
