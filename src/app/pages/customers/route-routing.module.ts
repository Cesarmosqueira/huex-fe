import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RouteComponent} from "./route/component/route.component";
import {RateComponent} from "./rate/component/rate.component";
import {CustomerComponent} from "./customer/component/customer.component";
import {CustomerEmployeesComponent} from "./customer-employees/component/customer-employees.component";

const routes: Routes = [
  {path:"route", component: RouteComponent},
  {path:"rate",component:RateComponent},
  {path:"customer",component:CustomerComponent},
  {path:"customer-employees",component:CustomerEmployeesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
