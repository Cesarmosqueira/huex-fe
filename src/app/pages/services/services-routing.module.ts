import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ExpenseTypeComponent} from "./expense-type/component/expense-type.component";
import {ServiceIncidentsComponent} from "./service-incidents/component/service-incidents.component";

const routes: Routes = [
  {path:"expenseType",component:ExpenseTypeComponent},
  {path:"serviceIncidents",component:ServiceIncidentsComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
