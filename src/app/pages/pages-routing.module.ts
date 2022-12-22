import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  { path: 'vehicles', loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule) },
  { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeeModule) },
  { path: 'customers', loadChildren: () => import('./customers/route.module').then(m => m.RouteModule) },
  { path: 'services', loadChildren: () => import('./services/services.module').then(m => m.ServicesModule) },
  { path: 'providers', loadChildren: () => import('./providers/providers.module').then(m => m.ProvidersModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
