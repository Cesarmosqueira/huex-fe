import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ExpenseTypeComponent} from "./expense-type/component/expense-type.component";

const routes: Routes = [
  {path:"expenseType",component:ExpenseTypeComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
