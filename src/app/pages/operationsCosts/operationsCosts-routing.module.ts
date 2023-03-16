import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TollComponent} from "./toll/component/toll.component";

const routes: Routes = [
  { path: "tolls", component: TollComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsCostsRouting { }
