import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../models/user';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listAllUsers(): Promise<Array<User>> {
    return firstValueFrom(
      this.http.get<Array<User>>(this.API_URL + '/admin/users/listAllUsers')
    ).catch((error) => {
      console.error('Error fetching users:', error);
      throw error;
    });
  } // listAllUsers
} // service
