import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ExpenseTypeComponent} from "./expense-type/component/expense-type.component";
import {ServiceIncidentsComponent} from "./service-incidents/component/service-incidents.component";
import {SettlementSummaryComponent} from "./settlement-summary/component/settlement-summary.component";

const routes: Routes = [
  {path:"expenseType",component:ExpenseTypeComponent},
  {path:"serviceIncidents",component:ServiceIncidentsComponent},
  {path:"settlementSummary",component:SettlementSummaryComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
