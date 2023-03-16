import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TollComponent} from "./toll/component/toll.component";
import {RouteRoutingModule} from "../customers/route-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModalModule, NgbNavModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {UIModule} from "../../shared/ui/ui.module";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {NgSelectModule} from "@ng-select/ng-select";
import {OperationsCostsRouting} from "./operationsCosts-routing.module";

@NgModule({
  declarations: [
    TollComponent
  ],
  imports: [
    CommonModule,
    OperationsCostsRouting,
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
export class OperationsCostsModule { }
