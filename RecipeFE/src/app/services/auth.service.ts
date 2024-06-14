import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, throwError, map, tap, Observable } from 'rxjs';
import { Logindetails } from '../interfaces/logindetails';
import { User } from '../interfaces/user';
import { LoggedInUser } from '../interfaces/loggedinuser';
import { RegisterDetails } from '../interfaces/registerdetails';
import { RegisteredUser } from '../interfaces/registereduser';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registered = new BehaviorSubject<RegisteredUser>({
    user: undefined,
    registeredState: false,
  });
  registered$ = this.registered.asObservable();

  private loggedIn = new BehaviorSubject<LoggedInUser>({
    user: undefined,
    loginState: false,
  });
  loggedIn$ = this.loggedIn.asObservable();

  private baseUrl: string = 'https://u06-fullstack-recipe-app-emiliaharden.onrender.com/api/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private router: Router) { }

  registeredUserState(registeredState: RegisteredUser) {
    this.registered.next(registeredState);
  }

  registerNewUser(registerDetails: RegisterDetails): Observable<any> {
    return this.http.post<any>(this.baseUrl+'register', registerDetails, this.httpOptions).pipe(catchError(this.handleError),
    tap(result => {
      console.log('Registrering lyckades', result);
      this.registeredUserState({
        user: result.user,
        registeredState: true,
      });

      localStorage.setItem('token', result.token);
      this.router.navigate(['/']);

      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', "Bearer " + result.token);
    }));
  }

  updateLoginState(loginState: LoggedInUser) {
    this.loggedIn.next(loginState);
  }
  getLoginStatus() {
    return this.loggedIn.value.loginState;
  }
  loginUser(LoginDetails: Logindetails): Observable<any> {
   return this.http
      .post<any>(this.baseUrl+'login', LoginDetails, this.httpOptions)
      .pipe(catchError(this.handleError),
      tap(result => {
        console.log('Inlogg lyckades för user:', result.user);
        this.updateLoginState({
          user: result.user,
          loginState: true,
        });
        // om result så tar vi det, som i det här fallet är token,
        // och sparar det i localStorage
        localStorage.setItem('token', result.token);
        this.router.navigate(['/']);

        this.httpOptions.headers = this.httpOptions.headers.set('Authorization', "Bearer " + result.token);
      }));
  }
  logoutUser() {
    this.http
      .post<any>(this.baseUrl + 'logout', {}, this.httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe((result) => {
        console.log(result);
        this.updateLoginState({
          user: result.user,
          loginState: false,
        });
        this.httpOptions.headers = this.httpOptions.headers.set(
          'Authorization',
          'Bearer ',
        );
      });
  }
  getCurrentUser(): Observable<User> {
    if(!this.loggedIn.value.user){
      return EMPTY;
    }
    return this.http
      .get<User[]>(
        this.baseUrl + 'getuser/' + this.loggedIn.value.user?.id,
        this.httpOptions
      )
      .pipe(map(users => users[0]),
      catchError(this.handleError));
  
  }

  handleError(error: HttpErrorResponse) {
    console.error('Error during login:', error);
    if (error.status === 500) {
      return throwError(() => new Error('Internal server error. Please try again later.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('An error occurred during login. Please try again later:', error.error));
    } else {
      console.error(
        `Backend returned code: ${error.status}, body was: `, error.error
      );
    }
    return throwError(() => new Error('Something bad happened: please try again later.'))
  }
}

