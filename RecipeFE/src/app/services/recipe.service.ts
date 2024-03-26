import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private baseUrl = 'https://api.edamam.com/api/recipes/v2?type=public';
  private app_key = '16555b91856f1cea4a19133db6eb6e06';
  private app_id = '677e757b';

  private httpOptions = {
    headers: new HttpHeaders({
      'accept':'application/json',
      'Accept-Language':'en'
    })
  }

  constructor(private http:HttpClient) { }

  getRecipes(searchterm = "Chicken", cuisineType="British", mealType="Dinner"): Observable<any> {
    let url = this.baseUrl + "&q=" + searchterm + "&app_id=" + this.app_id + "&app_key=" + this.app_key + "&cuisine_type=" + cuisineType + "&mealType=" + mealType;
    return this.http.get<any>(url, this.httpOptions);
  }

  getRecipe(id: string){
    
  }
}