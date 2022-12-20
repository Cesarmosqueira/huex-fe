import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProvinceEstivatorsComponent} from "./province-estivators/component/province-estivators.component";
import {ProviderComponent} from "./provider/component/provider.component";
import {TireReplacementComponent} from "./tire-replacement/component/tire-replacement.component";
import {FuelSupplyComponent} from "./fuel-supply/component/fuel-supply.component";


const routes: Routes = [

  {path:"province-estivators", component: ProvinceEstivatorsComponent},
  {path:"providers",component:ProviderComponent},
  {path:"tire-replacement",component:TireReplacementComponent},
  {path:"fuel-supply",component:FuelSupplyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
