import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'https://api.edamam.com/api/recipes/v2?type=public';
  private app_key = environment.API_KEY;
  private app_id = environment.API_ID;

  private httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json',
      'Accept-Language': 'en'
    })
  }

  constructor(private http: HttpClient) { }

  getAllRecipes(defaultQuery: string): Observable<any> {
    const url = `${this.baseUrl}&q=${defaultQuery}&app_id=${this.app_id}&app_key=${this.app_key}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  getRecipes(searchterm: string, mealTypes: string[], cuisineTypes: string[], healthLabels: string[]): Observable<any> {    
    let queryParams = '';

    if (searchterm) {
      queryParams += `&q=${encodeURIComponent(searchterm)}`;
    }
    if (mealTypes.length > 0) {
      const encodedMealTypes = mealTypes.map(type => encodeURIComponent(type));
      queryParams += `&mealType=${encodedMealTypes.join(',')}`;
    }
    if (cuisineTypes.length > 0) {
      const encodedCuisineTypes = cuisineTypes.map(type => encodeURIComponent(type));
      queryParams += `&cuisineType=${encodedCuisineTypes.join(',')}`;
    }
    if (healthLabels.length > 0) {
      const encodedHealthLabels = healthLabels.map(label => encodeURIComponent(label));
      queryParams += `&health=${encodedHealthLabels.join(',')}`;
    }

    const url = `${this.baseUrl}${queryParams}&app_id=${this.app_id}&app_key=${this.app_key}`;

    return this.http.get<any>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getRecipe(recipeId: string): Observable<any> {
    const recipeUrl = `https://api.edamam.com/api/recipes/v2/`;
    const url = `${recipeUrl}${recipeId}?type=public&app_id=${this.app_id}&app_key=${this.app_key}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened: please try again later.'));
  }
}
