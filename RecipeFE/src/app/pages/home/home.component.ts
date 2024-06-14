import { Component } from '@angular/core';
import { RecipesComponent } from '../recipes/recipes.component';
import { RecipeService } from '../../services/recipe.service';
import { Router, RouterLink } from '@angular/router';
import { Recipe } from '../../interfaces/recipe';
import { RecipeidformatterPipe } from '../../pipes/recipeidformatter.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipesComponent, RouterLink, RecipeidformatterPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
// recipes?: Recipe[];
recipes: any;

searchterm: any;
// cuisineType = "";
// mealType = "";
// healthLabel = "";

constructor(private recipeService: RecipeService, private router: Router) {}

ngOnInit(): void {
  this.showRecipes();
}

navigateToSearch() {
  console.log('förbereder att navigera till sök..');
  this.router.navigate(['/search']);
}

showRecipes() {
  this.recipeService.getAllRecipes(this.searchterm).subscribe(res => {
    console.log(res);
    let recipes: Recipe[];

    recipes = res.hits.map((item: { recipe: { label: any; image: any; ingredientLines: any; totalTime: any; healthLabels: any; }; _links: { self: { href: any; }; }; }) => {
      return {
        label: item.recipe.label,
        image: item.recipe.image,
        totalTime: item.recipe.totalTime,
        ingredientLines: item.recipe.ingredientLines,
        selfref: item._links.self.href,
        healthLabels: item.recipe.healthLabels,
      }
    });

    console.table(recipes);
    this.recipes = recipes;
  });
}
}
