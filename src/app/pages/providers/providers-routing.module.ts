import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProvinceEstivatorsComponent} from "./province-estivators/component/province-estivators.component";
import {ProviderComponent} from "./provider/component/provider.component";


const routes: Routes = [

  {path:"province-estivators", component: ProvinceEstivatorsComponent},
  {path:"providers",component:ProviderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
