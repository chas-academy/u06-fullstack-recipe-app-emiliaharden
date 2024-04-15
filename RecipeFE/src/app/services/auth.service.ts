import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, throwError, map } from 'rxjs';
import { Logindetails } from '../interfaces/logindetails';
import { User } from '../interfaces/user';
import { LoggedInUser } from '../interfaces/loggedinuser';
import { RegisterDetails } from '../interfaces/registerdetails';
import { RegisteredUser } from '../interfaces/registereduser';


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

  private baseUrl = 'https://u06-fullstack-recipe-app-emiliaharden.onrender.com/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  registeredUserState(registeredState: RegisteredUser) {
    this.registered.next(registeredState);
  }

  registerNewUser(registerDetails: RegisterDetails) {
    this.http.post<any>(this.baseUrl + 'register', registerDetails, this.httpOptions).pipe(catchError(this.handleError)).subscribe(result => {
      console.log(result);
      this.registeredUserState({
        user: result.user,
        registeredState: true,
      });
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + result.token);
    });
  }

  updateLoginState(loginState: LoggedInUser) {
    this.loggedIn.next(loginState);
  }
  getLoginStatus() {
    return this.loggedIn.value.loginState;
  }
  loginUser(LoginDetails: Logindetails) {
    this.http
      .post<any>(this.baseUrl + 'login', LoginDetails, this.httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe((result) => {
        console.log(result);
        this.updateLoginState({
          user: result.user,
          loginState: true,
        });
        this.httpOptions.headers = this.httpOptions.headers.set(
          'Authorization',
          'Bearer ' + result.token
        );
      });
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
  getCurrentUser() {
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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      console.error('An error occurred', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was `,
        error.error
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later')
    );
  }
}

