import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AuthorComponent } from './author/author.component';
import { EmployeeDetails1Component } from './employee-details1/employee-details1.component';
import { HomepageComponent } from './homepage/homepage.component';




const routes: Routes = [
  {path:'',redirectTo:'homepage',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'dashboard', component:EmployeeDashboardComponent},
  {path:'author', component:AuthorComponent},
  { path: 'employee1', component: EmployeeDetails1Component },
  {path: 'homepage', component: HomepageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
