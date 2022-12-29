import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckListComponent } from './check-list/components/check-list.component';
import { DocumentUnitComponent } from './document-unit/components/document-unit.component';
import { KardexFuelComponent } from './kardex-fuel/components/kardex-fuel.component';
import { MaintenanceOilComponent } from './maintenance-oil/components/maintenance-oil.component';
import { MaintenanceTireComponent } from './maintenance-tire/components/maintenance-tire.component';
import { TruckFleetComponent } from './truck-fleet/components/truck-fleet.component';

const routes: Routes = [
  {
    path: "truck-fleet",
    component: TruckFleetComponent
  },
  {
    path: "check-list",
    component: CheckListComponent
  },
  {
    path: "documents",
    component: DocumentUnitComponent
  },
  {
    path: "maintenance-tire",
    component: MaintenanceTireComponent
  },
  {
    path: "maintenance-oil",
    component: MaintenanceOilComponent
  },
  {
    path: "kardex-fuel",
    component: KardexFuelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }
