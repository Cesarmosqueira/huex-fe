import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmployeeComponent} from './employee/component/employee.component';
import {ImplementComponent} from "./implement/component/implement.component";

const routes: Routes = [
  {path:"employee", component: EmployeeComponent},
  {path:"implement",component:ImplementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
