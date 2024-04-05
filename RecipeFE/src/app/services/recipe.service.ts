import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterRecipes } from '../interfaces/filter-recipes';

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

  // getRecipes(searchterm = "Chicken", cuisineType="British", mealType="Dinner"): Observable<any> {
  //   let url = this.baseUrl + "&q=" + searchterm + "&app_id=" + this.app_id + "&app_key=" + this.app_key + "&cuisine_type=" + cuisineType + "&mealType=" + mealType;
  //   return this.http.get<any>(url, this.httpOptions);
  // }

  getRecipes(filter:FilterRecipes): Observable<any> {
    let url = `${this.baseUrl}&app_id=${this.app_id}&app_key=${this.app_key}`
    if(filter.searchterm){
      url += `&q=${filter.searchterm}`;
    }
    if(filter.healthLabel){
      url += `&health=${filter.healthLabel}`;
    }
    if(filter.cuisineType){
      url += `&cuisine_type=${filter.cuisineType}`;
    }
    if(filter.mealType){
      url += `&meal_type=${filter.mealType}`;
    }
    url = encodeURI(url);
    return this.http.get(url, this.httpOptions);
  }


  getRecipe(recipeId: string): Observable<any> {
    let recipeUrl = `https://api.edamam.com/api/recipes/v2/`;
    let url = `${recipeUrl}${recipeId}?type=public&app_id=${this.app_id}&app_key=${this.app_key}`;
    return this.http.get<any>(url,this.httpOptions);
  }

}