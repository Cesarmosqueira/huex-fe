import {Component, OnInit} from "@angular/core";
import {Employee} from "../models/employee";
import {EmployeeService} from "../services/employee";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    console.log("entroooooooooooooooooooooooo");
  }
}
