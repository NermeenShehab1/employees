export class EmployeeModels {
  constructor(public empId: number = 0, public empName: string = "", public empEmail: string = "", public empAddress: string = "", public empPhone: string = "") { }
  selected?: boolean; // Optional property for checkbox selection

}

