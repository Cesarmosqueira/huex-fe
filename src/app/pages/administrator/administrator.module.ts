import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { UserComponent } from './user/component/user.component';
import { NgbModalModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UIModule } from 'src/app/shared/ui/ui.module';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    NgbModalModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgSelectModule,
    UIModule,
  ]
})
export class AdministratorModule { }
