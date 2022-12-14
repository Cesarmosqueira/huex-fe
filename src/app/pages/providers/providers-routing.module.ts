import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProvinceEstivators} from "./province-estivators/models/province-estivators.model";

const routes: Routes = [
  {path:"provinceEstivators",component:ProvinceEstivators}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
