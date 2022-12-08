import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CrudComponent} from './crud/component/crud.component';
import {TemplateRoutingModule} from './template-routing.module';


@NgModule({
  declarations: [
    CrudComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TemplatesModule { }
