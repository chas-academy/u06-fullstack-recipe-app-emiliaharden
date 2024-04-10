import { Component } from '@angular/core';
import { RecipesComponent } from '../recipes/recipes.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
