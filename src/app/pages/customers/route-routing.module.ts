import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RouteComponent} from "./route/component/route.component";

const routes: Routes = [
  {
    path:"route",
    component: RouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
