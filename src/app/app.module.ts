import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { EmployeeIndexComponent } from './feature-modules/employee/employee-index/employee-index.component';
import { EmployeeEditComponent } from './feature-modules/employee/employee-edit/employee-edit.component';
import { AddEmployeeComponent } from './feature-modules/employee/add-employee/add-employee.component';



@NgModule({
  declarations: [
    AppComponent,
    EmployeeIndexComponent,
    EmployeeEditComponent,
    AddEmployeeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule, HttpClientModule,
    RouterModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],

  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }


