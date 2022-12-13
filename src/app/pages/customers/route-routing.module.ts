import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RouteComponent} from "./route/component/route.component";
import {RateComponent} from "./rate/component/rate.component";

const routes: Routes = [
  {path:"route", component: RouteComponent},
  {path:"rate",component:RateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
