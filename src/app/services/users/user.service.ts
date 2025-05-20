import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/v1/created`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/v1/update/${user.id}`, user);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/v1/list/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/v1/list`);
  }

  getAllUsersPaginated(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.api}/v1/list?page=${page}&size=${size}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(
      `${this.api}/v1/by-email?email=${encodeURIComponent(email)}`
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.api}/v1/me`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/v1/delete/${id}`);
  }
}
