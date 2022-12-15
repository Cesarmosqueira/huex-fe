import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouteComponent} from "./route/component/route.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModalModule, NgbNavModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {UIModule} from "../../shared/ui/ui.module";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {NgSelectModule} from "@ng-select/ng-select";
import {RouteRoutingModule} from "./route-routing.module";
import { RateComponent } from './rate/component/rate.component';
import { CustomerComponent } from './customer/component/customer.component';



@NgModule({
  declarations: [
    RouteComponent,
    RateComponent,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    RouteRoutingModule,
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
export class RouteModule { }
