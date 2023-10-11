import { Component, OnInit } from '@angular/core';
import { EmployeeModels } from '../../../core/models/employee.models';
import { EmployeeService } from '../../../core/services/employee.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { EmployeeDataService } from 'src/app/core/services/employeeData.service';

@Component({
  selector: 'app-employee-index',
  templateUrl: './employee-index.component.html',
  styleUrls: ['./employee-index.component.css'],
})
export class EmployeeIndexComponent implements OnInit {
  paginator = true;
  rows = 10;
  showCurrentPageReport = true;
  tableStyle = 'width: 100%';
  currentPageReportTemplate = '{last} out of {totalRecords} employees';
  rowsPerPageOptions = [5, 10, 20, 50];
  isLoading = true;
  employees: EmployeeModels[] = [];
  selectAll = false;
  showPopUp = false;
  employee: EmployeeModels = { empId: 0, empName: '', empEmail: '', empAddress: '', empPhone: '' };
  submitted = false;
  employeeForm: FormGroup;
  selectedEmps: EmployeeModels[] = [];
  constructor(
    public empserve: EmployeeService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private employeeDataService: EmployeeDataService
  ) {
    this.employeeForm = this.formBuilder.group({
      empName: ['', Validators.required],
      empEmail: ['', [Validators.required, Validators.email]],
      empPhone: ['', [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)]],
      empAddress: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.fetchEmps();
    this.subscribeToEmployeeUpdates();
  }
  subscribeToEmployeeUpdates() {
    this.employeeDataService.employeeUpdated$.subscribe(() => {
      this.fetchEmps(); 
    });
  }
  fetchEmps(): void {
    this.empserve.listEmps().subscribe(
      (emps) => {
        this.employees = emps.map(emp => ({ ...emp, selected: false }));
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.isLoading = false;
      }
      );
  }
  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.valid) {
      this.saveEmp();
    }
  }
  saveEmp() {
    const formValues = this.employeeForm.value;
    this.employee = {
      empId: formValues.empId ?? 0,
      empName: formValues.empName,
      empEmail: formValues.empEmail,
      empPhone: formValues.empPhone,
      empAddress: formValues.empAddress
    };
    this.empserve.addEmp(this.employee).subscribe(
      (addData) => {
        this.employees = [...this.employees];
        this.employeeForm.reset();
        this.hideDialog();
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }
  hideDialog() {
    this.showPopUp = false;
    this.submitted = false;
  }
  deleteEmployee(employee: EmployeeModels) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedEmpId = employee?.empId;
        if (selectedEmpId !== undefined) {
          this.deleteEmployeeById(selectedEmpId);
        } 
      }
    });
  }
  private deleteEmployeeById(employeeId: number) {
    this.empserve.deleteEmp(employeeId).subscribe(
      () => {
        this.employees = this.employees.filter((data) => data.empId !== employeeId);
      },
      (error) => {
        console.error('Error deleting employee', error);
      }
    );
  }
  openEditDialog(employee: EmployeeModels) {
    const modalRef = this.modalService.open(EmployeeEditComponent);
    modalRef.componentInstance.employee = employee;
    modalRef.result.then(
      (updatedEmployee) => {
        console.log('Updated employee data:', updatedEmployee);
      },
      (dismissReason) => {
        console.log('Dismiss reason:', dismissReason);
      }
    );
  }
  openAddEmployeeModal() {
    const modalRef = this.modalService.open(AddEmployeeComponent);
    modalRef.result.then(
      (newEmployee) => {
        this.employees.push(newEmployee);
      },
      (dismissReason) => {
        console.log('Dismiss reason:', dismissReason);
      }
    );
  }
  handleCheckboxChange(employee: EmployeeModels) {
    if (employee.selected) {
      this.selectedEmps.push(employee);
    } else {
      this.selectedEmps = this.selectedEmps.filter(emp => emp.empId !== employee.empId);
    }
  }
  toggleSelectAll() {
    this.employees.forEach(employee => employee.selected = this.selectAll);
    this.updateSelectedEmps();
  }
  updateSelectedEmps() {
    this.selectedEmps = this.employees.filter(emp => emp.selected);
  }
  deleteSelectedEmps() {
    if (this.selectedEmps.length > 0) {
      const selectedEmpIds = this.selectedEmps.map(emp => emp.empId);
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete them!',
      }).then((result) => {
        if (result.isConfirmed) {
          selectedEmpIds.forEach(empId => {
            this.deleteEmployeeById(empId);
          });
        }
      });
    }
  }
}
