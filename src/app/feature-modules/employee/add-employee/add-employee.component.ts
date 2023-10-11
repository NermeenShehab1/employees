import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { EmployeeDataService } from 'src/app/core/services/employeeData.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public empService: EmployeeService,
    private employeeDataService: EmployeeDataService

  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.employeeForm = this.formBuilder.group({
      empName: ['', Validators.required],
      empEmail: ['', [Validators.required, Validators.email]],
      empPhone: ['', [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)]],
      empAddress: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const newEmployee = this.employeeForm.value;
      this.empService.addEmp(newEmployee).subscribe(() => {
        this.employeeDataService.emitEmployeeUpdatedSignal();
        this.activeModal.close(newEmployee);
      });
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
  }
}
