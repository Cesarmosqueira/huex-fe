import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { TruckFleetComponent } from './truck-fleet/component/truck-fleet.component';


@NgModule({
  declarations: [
    TruckFleetComponent
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule
  ]
})
export class VehiclesModule { }
