import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProvinceEstivatorsComponent} from "./province-estivators/component/province-estivators.component";


const routes: Routes = [

  {path:"province-estivators", component: ProvinceEstivatorsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
