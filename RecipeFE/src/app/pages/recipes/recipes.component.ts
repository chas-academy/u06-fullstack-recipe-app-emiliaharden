import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/recipe';
import { RecipeService } from '../../services/recipe.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeidformatterPipe } from "../../pipes/recipeidformatter.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipes',
  standalone: true,
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  imports: [FormsModule, RouterLink, RecipeidformatterPipe, CommonModule]
})
export class RecipesComponent implements OnInit {
  recipes?: Recipe[];
  filteredRecipes?: Recipe[];
  searchterm: string = '';

  mealTypes: string[] = ['breakfast', 'brunch', 'lunch', 'dinner', 'snack', 'teatime'];
  cuisineTypes: string[] = ["italian", "mexican", "indian", "chinese", 'british', 'greek', 'eastern europe', 'mediterranean'];
  healthLabels: string[] = ["vegetarian", "vegan", 'shellfish-free', 'dairy-free', 'gluten-free', 'pescatarian', 'peanut-free', 'egg-free'];
  selectedMealTypes: string[] = [];
  selectedCuisineTypes: string[] = [];
  selectedHealthLabels: string[] = [];

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['.'], { relativeTo: this.route });
    this.route.url.subscribe(url => {
      if (url[0] !== undefined && url[0].path === 'search') {
        this.searchRecipe();
      }
    });
  }

  updateSelectedMealTypes(event: Event): void {
    const options = (event.target as HTMLSelectElement).options;
    this.selectedMealTypes = Array.from(options).filter(option => option.selected).map(option => option.value);
    this.filterRecipes();
  }

  updateSelectedCuisineTypes(event: Event): void {
    const options = (event.target as HTMLSelectElement).options;
    this.selectedCuisineTypes = Array.from(options).filter(option => option.selected).map(option => option.value);
    this.filterRecipes();
  }

  updateSelectedHealthLabels(event: Event): void {
    const options = (event.target as HTMLSelectElement).options;
    this.selectedHealthLabels = Array.from(options).filter(option => option.selected).map(option => option.value);
    this.filterRecipes();
  }

  searchRecipe(): void {
    const searchterm = this.searchterm.trim();
    this.recipeService.getRecipes(searchterm, this.selectedMealTypes, this.selectedCuisineTypes, this.selectedHealthLabels).subscribe((res: any) => {
      console.log(res);
      const recipes = res.hits.map((item: { recipe: { label: string; image: string; ingredientLines: string[]; totalTime: number; }; _links: { self: { href: string; }; }; }) => ({
        label: item.recipe.label,
        image: item.recipe.image,
        ingredientLines: item.recipe.ingredientLines,
        totalTime: item.recipe.totalTime,
        selfref: item._links.self.href,
      }));
      console.table(recipes);
      this.recipes = recipes;
      this.filterRecipes();
    });
  }

  filterRecipes(): void {
    if (!this.recipes) {
      this.filteredRecipes = [];
      return;
    }
  
    this.filteredRecipes = this.recipes.filter(recipe => {
      // Filtrera baserat på valda mealTypes
      const mealTypeMatch = this.selectedMealTypes.length === 0 || (recipe.mealType && this.selectedMealTypes.some(type => recipe.mealType.includes(type)));
  
      // Filtrera baserat på valda cuisineTypes
      const cuisineTypeMatch = this.selectedCuisineTypes.length === 0 || (recipe.cuisineType && this.selectedCuisineTypes.some(type => recipe.cuisineType.includes(type)));
  
      // Filtrera baserat på valda healthLabels
      const healthLabelMatch = this.selectedHealthLabels.length === 0 || (recipe.healthLabels && this.selectedHealthLabels.some(label => recipe.healthLabels.includes(label)));
  
      // Returnera true om receptet matchar alla valda kriterier
      return mealTypeMatch && cuisineTypeMatch && healthLabelMatch;
    });
  }
  
}
