import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = 'http://localhost:3000'

  constructor(private http: HttpClient, private router: Router) { }

  public sign(payload: { email: string, password: string }): Observable<any> {
    return this.http.post<{ access_token: string, expires_in: number, token_type: string }>(`${this.url}/sign`, payload).pipe(
      map((res) => {
        let expirationDate: Date = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + res.expires_in);

        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiration_date');

        localStorage.setItem('access_token', res.access_token)
        localStorage.setItem('token_expiration_date', JSON.stringify(expirationDate))

        return this.router.navigate(['admin']);
      }),
      catchError((err) => {
        if(err.error.message) {
          return throwError(() => err.error.message);
        }

        return throwError(() => 'Um erro inesperado ocorreu. Tente novamente mais tarde!');
      })
    );
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration_date');

    return this.router.navigate(['']);
  }
}
