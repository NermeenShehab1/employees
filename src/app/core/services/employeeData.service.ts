import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDataService {
  private employeeUpdatedSource = new Subject<void>();

  employeeUpdated$ = this.employeeUpdatedSource.asObservable();

  emitEmployeeUpdatedSignal() {
    this.employeeUpdatedSource.next();
  }
}
