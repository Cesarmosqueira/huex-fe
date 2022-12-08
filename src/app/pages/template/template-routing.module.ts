import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CrudComponent} from './crud/component/crud.component';

const routes: Routes = [
  {
    path:"crud",
    component: CrudComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
