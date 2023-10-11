import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeIndexComponent } from './feature-modules/employee/employee-index/employee-index.component';

const routes: Routes = [
  {path:"employees",component:EmployeeIndexComponent},
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
