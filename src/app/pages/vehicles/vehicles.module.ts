import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from '../../shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { VehiclesRoutingModule } from './vehicles-routing.module';
import { TruckFleetComponent } from './truck-fleet/components/truck-fleet.component';

import { NgbNavModule, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckListComponent } from './check-list/components/check-list.component';
import { DocumentUnitComponent } from './document-unit/components/document-unit.component';
import { KardexFuelComponent } from './kardex-fuel/components/kardex-fuel.component';
import { MaintenanceOilComponent } from './maintenance-oil/components/maintenance-oil.component';
import { MaintenanceTireComponent } from './maintenance-tire/components/maintenance-tire.component';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';


const config: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 100,
};

@NgModule({
  declarations: [
    TruckFleetComponent,
    CheckListComponent,
    DocumentUnitComponent,
    KardexFuelComponent,
    MaintenanceOilComponent,
    MaintenanceTireComponent
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    UIModule,
    Ng2SearchPipeModule,
    NgbDatepickerModule,
    NgSelectModule,
    DropzoneModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: config
    }
  ]
})
export class VehiclesModule { }
