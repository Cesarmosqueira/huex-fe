import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvidersRoutingModule } from './providers-routing.module';
import { ProviderComponent } from './provider/component/provider.component';
import { ProvinceEstivatorsComponent } from './province-estivators/component/province-estivators.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModalModule, NgbNavModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {UIModule} from "../../shared/ui/ui.module";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [
    ProviderComponent,
    ProvinceEstivatorsComponent
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
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
export class ProvidersModule { }
