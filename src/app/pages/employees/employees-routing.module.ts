import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmployeeComponent} from './employee/component/employee.component';
import {ImplementComponent} from "./implement/component/implement.component";
import {EmployeeImplementComponent} from "./employee-implement/component/employee-implement.component";
import {EmployeeAttendanceComponent} from "./employee-attendance/component/employee-attendance.component";
import {EmployeeDiscountComponent} from "./employee-discount/component/employee-discount.component";

const routes: Routes = [
  {path:"employee", component: EmployeeComponent},
  {path:"implement",component:ImplementComponent},
  {path:"employee-implement",component:EmployeeImplementComponent},
  {path:"employee-attendance",component:EmployeeAttendanceComponent},
  {path:"employee-discount",component:EmployeeDiscountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
