import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { PostsCreateComponent } from './posts/posts-create/posts-create.component';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostsListComponent },
  { path: 'create', component: PostsCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostsCreateComponent, canActivate: [AuthGuard] },
  
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent }  

  // Lazy loading
  { 
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule) 
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
