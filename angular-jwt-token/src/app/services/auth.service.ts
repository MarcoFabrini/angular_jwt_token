import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// interface
import { User } from '../models/user';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { SignupRequest } from '../models/signup-request';
import { SignupResponse } from '../models/signup-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
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

  getAuthenticatedUser(): Promise<User> {
    return firstValueFrom(
      this.http.get<User>(
        this.API_URL + '/user/users/getAuthenticatedUser'
      )
    ).then((user) => {
      this.currentUserSubject.next(user);
      this.isAdminSubject.next(this.isAdmin(user));
      return user;
    });
  } // getAuthenticatedUser

  logout() {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.isAdminSubject.next(false);
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

    if (!this.getAuthorizationToken()) return false;

    return true;
  } // hasValidToken

  getAuthorizationToken(): string {
    return localStorage.getItem('authToken') || '';
  } // getAuthorizationToken

  private isAdmin(user: User): boolean {
    return user.role.includes('ROLE_ADMIN');
  } // isAdmin
} // service
