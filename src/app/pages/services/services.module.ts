import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExpenseTypeComponent} from "./expense-type/component/expense-type.component";
import {ServicesRoutingModule} from "./services-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModalModule, NgbNavModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {UIModule} from "../../shared/ui/ui.module";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {NgSelectModule} from "@ng-select/ng-select";
import { ServiceIncidentsComponent } from './service-incidents/component/service-incidents.component';
import { SettlementSummaryComponent } from './settlement-summary/component/settlement-summary.component';
import { ServiceMonitoringComponent } from './service-monitoring/component/service-monitoring.component';
import { TrackingComponent } from './tracking/component/tracking.component';
import { AdditionalServicesComponent } from './additional-services/component/additional-services.component';



@NgModule({
  declarations: [
    TrackingComponent,
    ExpenseTypeComponent,
    ServiceIncidentsComponent,
    SettlementSummaryComponent,
    ServiceMonitoringComponent,
    AdditionalServicesComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    UIModule,
    Ng2SearchPipeModule,
    NgbDatepickerModule,
    NgSelectModule
  ]
})
export class ServicesModule { }
