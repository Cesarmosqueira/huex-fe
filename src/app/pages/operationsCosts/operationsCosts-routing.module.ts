import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TollComponent} from "./toll/component/toll.component";
import {RouteTollComponent} from "./route-toll/component/route-toll.component";

const routes: Routes = [
  { path: "tolls", component: TollComponent },
  { path:"route-tolls",component:RouteTollComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsCostsRouting { }
