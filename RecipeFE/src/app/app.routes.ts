import { Routes } from '@angular/router';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'search', component:RecipesComponent},
    {path:'recipe/:id', component:RecipeComponent},
    {path:'profile', component:ProfileComponent, canActivate: [authGuard]},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent}
];