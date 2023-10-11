import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeModels } from '../models/employee.models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  baseurl: string = "http://task.soft-zone.net/api/Employees/"
  private updatedEmployeeSource = new BehaviorSubject<EmployeeModels | null>(null);
  updatedEmployee$ = this.updatedEmployeeSource.asObservable();

  constructor(public http: HttpClient) {

  }

  listEmps() {
    return this.http.get<EmployeeModels[]>(this.baseurl + 'getAllEmployees/');
  }

  addEmp(emp: EmployeeModels) {
    console.log('addEmp() called with employee:', emp);
    return this.http.post<EmployeeModels[]>(this.baseurl + 'addEmployee', emp);
  }

  deleteEmp(id: number) {
    return this.http.get<EmployeeModels>(this.baseurl + "deleteEmpByID/" + id);
  }


  deleteEmps(employeeIds: number[]) {
    return this.http.get<EmployeeModels>(this.baseurl + "deleteEmpByID/" + employeeIds);
  }

  editEmp(emp: EmployeeModels) {
    return this.http.post<EmployeeModels>(this.baseurl + "editEmployee/", emp);
  }

  updateEmployee(updatedEmployee: EmployeeModels) {
    this.updatedEmployeeSource.next(updatedEmployee); 
  }
}
