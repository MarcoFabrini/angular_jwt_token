import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  errorMsg: string | null = null;
  isLoading: boolean = false;

  loginObj = {
    email: '',
    password: '',
  };

  onLogin() {
    this.isLoading = true;

    this.authService.loginUser(this.loginObj).subscribe({
      next: (response) => {
        if (response.token) {
          this.errorMsg = null;
          this.router.navigateByUrl('/dashboard/home');
        } else {
          this.errorMsg = response.description || 'Invalid email or password';
        }
      },
      error: (error) => {
        this.errorMsg = error.error?.description || 'Login failed';
      },
      complete: () => (this.isLoading = false),
    });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
