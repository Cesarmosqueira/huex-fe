import { Component , OnInit} from '@angular/core';
import { LoadingComponent } from './shared/ui/loading/loading.component';

@Component({
  selector: 'app-root',
  template: `
  <ng-http-loader [entryComponent]="compartamosLoading" ></ng-http-loader>
  <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit  {

  public compartamosLoading = LoadingComponent;

  ngOnInit() {
    // document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  }
}
