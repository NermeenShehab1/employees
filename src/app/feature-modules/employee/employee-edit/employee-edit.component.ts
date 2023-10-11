import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeModels } from '../../../core/models/employee.models';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { EmployeeDataService } from 'src/app/core/services/employeeData.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
})
export class EmployeeEditComponent implements OnInit {
  @Input() employee: EmployeeModels = {
    empId: 0,
    empName: '',
    empEmail: '',
    empAddress: '',
    empPhone: '',
  };

  employeeEditForm!: FormGroup;
  isSaving = false;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public empserve: EmployeeService,
    private employeeDataService: EmployeeDataService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.employeeEditForm = this.formBuilder.group({
      empId: [this.employee.empId],
      empName: [this.employee.empName, Validators.required],
      empEmail: [
        this.employee.empEmail,
        [Validators.required, Validators.email],
      ],
      empPhone: [
        this.employee.empPhone,
        [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)],
      ],
      empAddress: [this.employee.empAddress, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeEditForm.valid) {
      this.isSaving = true;

      this.updateEmployeeData();

      this.empserve.editEmp(this.employee).subscribe(
        (updatedEmployee) => {
          this.isSaving = false;
          this.empserve.updateEmployee(updatedEmployee);
          this.employeeDataService.emitEmployeeUpdatedSignal();
          this.activeModal.close(this.employeeEditForm.valid);
        },
        (error) => {
          this.isSaving = false;
          console.error('Error saving data:', error);
        }
      );
    }
  }

  private updateEmployeeData(): void {
    const formValues = this.employeeEditForm.value;
    this.employee.empName = formValues.empName;
    this.employee.empEmail = formValues.empEmail;
    this.employee.empPhone = formValues.empPhone;
    this.employee.empAddress = formValues.empAddress;
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
