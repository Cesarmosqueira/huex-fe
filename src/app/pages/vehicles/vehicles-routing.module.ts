import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruckFleetComponent } from './truck-fleet/component/truck-fleet.component';

const routes: Routes = [
  {
   path:"truck-fleet",
   component: TruckFleetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }
