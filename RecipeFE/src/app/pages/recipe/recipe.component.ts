import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent implements OnInit {
  id?: string;
  recipe:any;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = String(params.get('id'));
      if(this.id){
        console.log(this.id);
        this.loadRecipe(this.id);
      }
    });
  }
  loadRecipe(id:string) {
    console.log('loadRecipeCalledWithId:', id);
    this.recipeService.getRecipe(id).subscribe({
      next: (data)=> {
        console.log('Recieved recipe data', data);
        this.recipe = data;
      },
      error: (error) => {
        console.error('Error fetching recipe', error);
      },
    });
  }
}