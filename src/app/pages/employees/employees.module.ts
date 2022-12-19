import {CommonModule, DecimalPipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {EmployeeComponent} from './employee/component/employee.component';
import {EmployeeRoutingModule} from './employees-routing.module';

import {NgSelectModule} from '@ng-select/ng-select';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {UIModule} from '../../shared/ui/ui.module';

import {NgbDatepickerModule, NgbModalModule, NgbNavModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

import {FormsModule} from '@angular/forms';
import { ImplementComponent } from './implement/component/implement.component';
import { EmployeeImplementComponent } from './employee-implement/component/employee-implement.component';
import { EmployeeAttendanceComponent } from './employee-attendance/component/employee-attendance.component';



@NgModule({
  declarations: [
    EmployeeComponent,
    ImplementComponent,
    EmployeeImplementComponent,
    EmployeeAttendanceComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    UIModule,
    Ng2SearchPipeModule,
    NgbDatepickerModule,
    NgSelectModule
  ],
  providers: [DecimalPipe],
  exports: [
    EmployeeComponent
  ]
})
export class EmployeeModule { }
