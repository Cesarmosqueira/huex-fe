import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { TruckFleet } from '../models/truck-fleet.model';
import { TruckFleetService } from '../services/truck-fleet.service';

@Component({
  selector: 'app-truck-fleet',
  templateUrl: './truck-fleet.component.html',
  styleUrls: ['./truck-fleet.component.scss']
})
export class TruckFleetComponent implements OnInit {

  truckFleet: TruckFleet[] = [];

  constructor(private truckFleetService: TruckFleetService) { }

  ngOnInit(): void {
    console.log("entroooooooooooooooooooooooo");
    this.listTruckFleets();
  }


  listTruckFleets() {
    this.truckFleetService.listTruckFleets()
      .pipe(first())
      .subscribe(
        response => {
          console.log("esssssssssssssssssssssssssssssssssssssssss" + response);
          if (response) {
            if (response.datos) {
              console.log(response.datos);
              this.truckFleet = response.datos;
              console.log(this.truckFleet);
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error, comuniquese con el Banco",
              showConfirmButton: false,
            });
          }
        },
        error => {
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }

}
