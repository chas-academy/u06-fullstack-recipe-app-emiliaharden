import { Component } from '@angular/core';
import { Recipe } from '../../interfaces/recipe';
import { RecipeService } from '../../services/recipe.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeidformatterPipe } from "../../pipes/recipeidformatter.pipe";
import { CommonModule } from '@angular/common';
import { FilterRecipes } from '../../interfaces/filter-recipes';

@Component({
  selector: 'app-recipes',
  standalone: true,
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  imports: [FormsModule, RouterLink, RecipeidformatterPipe, CommonModule]
})
export class RecipesComponent {
  recipes?: Recipe[];

  filter: FilterRecipes ={
    searchterm: '',
    mealType: '',
    healthLabel: '',
    cuisineType: '',
}

  constructor(private recipeService: RecipeService) { }

  searchRecipe() {
    this.recipeService.getRecipes(this.filter).subscribe((result) => {
      console.log(result);
      let recipes: Recipe[];
      recipes = result.hits.map((item: { recipe: { label: any; image: any; ingredientLines: any; totalTime: any; }; _links: { self: { href: any; }; }; }) => {
        return {
          label: item.recipe.label,
          image: item.recipe.image,
          ingredientLines: item.recipe.ingredientLines,
          totalTime: item.recipe.totalTime,
          selfref: item._links.self.href,
        };
      });
      console.table(recipes);
      this.recipes = recipes;
    });
  }
}


