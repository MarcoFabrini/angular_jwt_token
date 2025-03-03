import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expiresIn: number;
  description?: string;
} // LoginResponse

interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
} // SignupRequest

interface SignupResponse {
  id: number;
  email: string;
  fullName: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.hasValidToken()) {
      this.getAuthenticatedUser();
    }
  } // constructor

  loginUser(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.API_URL + '/auth/login', loginData)
      .pipe(
        tap((response) => {
          this.saveAuthData(response.token);
          this.isAuthenticatedSubject.next(true);
          this.getAuthenticatedUser();
        }),
        catchError((error) => {
          console.error('Login error: ', error);
          return of(error.error);
        })
      );
  } // loginUser

  getAuthenticatedUser(): void {
    this.http
      .get<any>(this.API_URL + "/user/users/getAuthenticatedUser")
      .pipe(
        tap((response) => {
          console.log('User data received: ', response);
          this.currentUserSubject.next(response);
        }),
        catchError((error) => {
          console.error('Error in retrieving user data: ', error);
          this.logout();
          return of(null);
        })
      )
      .subscribe();
  } // getAuthenticatedUser

  logout() {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  } // logout

  signupUser(signupData: SignupRequest): Observable<SignupResponse> {
    return this.http
      .post<SignupResponse>(this.API_URL + '/auth/signup', signupData)
      .pipe(
        tap((response) =>
          console.log('User signed up successfully: ', response)
        ),
        catchError((error) => {
          console.error('Signup error:', error);
          return of(error.error);
        })
      );
  } // signupUser

  private saveAuthData(token: string) {
    localStorage.setItem('authToken', token);
  } // saveAuthData

  private hasValidToken(): boolean {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }

    const token = localStorage.getItem('authToken');

    if (!token) return false;

    return true;
  } // hasValidToken

  getAuthorizationToken(): string {
    return localStorage.getItem('authToken') || '';
  } // getAuthorizationToken

  isAdmin(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => !!user?.authorities?.includes('ROLE_ADMIN'))
    );
  } // isAdmin
}// service
