import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { KardexFuel } from '../models/kardex-fuel';
import { KardexFuelService } from '../services/kardex-fuel.service';

@Component({
  selector: 'app-kardex-fuel',
  templateUrl: './kardex-fuel.component.html',
  styleUrls: ['./kardex-fuel.component.scss']
})
export class KardexFuelComponent implements OnInit {

  @Input () idTruckFleet: number;
  
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  kardexFuelForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  kardexFuels?: any;
  kardexFuelsResponse: KardexFuel[] = [];
  kardexFuelsList!: Observable<KardexFuel[]>;
  total: Observable<number>;
  pipe: any;
  selectProvider = null;

  image: any;
  file: File = null;
  new = false;
  textButton = "Registrar";

  constructor(public service: KardexFuelService,
    private formBuilder: UntypedFormBuilder) {
    this.kardexFuelsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {

    this.kardexFuelForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      date: ['', [Validators.required]],
      amountFuel: ['', [Validators.required]],
      mileage: ['', [Validators.required]],
      dutyManager: ['', [Validators.required]]
    });

    this.kardexFuelsList.subscribe(x => {
      this.content = this.kardexFuels;
      this.kardexFuels = Object.assign([], x);
    });

    this.listKardexFuels();
  }

  delete(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Está seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          this.deleteKardexFuel(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }

  cancel() {
    this.clearControl();
    this.new = false;
    this.textButton = "Registrar";
  }

  openModal(value) {
    this.new = value;
  }

  get form() {
    return this.kardexFuelForm.controls;
  }

  saveKardexFuel() {
    this.submitted = true
    if (this.kardexFuelForm.valid) {
      this.pipe = new DatePipe('en-US');
      const id = this.kardexFuelForm.get('id')?.value;
      const idTruckFleet = this.idTruckFleet;
      const date = this.kardexFuelForm.get('date')?.value;
      const amountFuel = this.kardexFuelForm.get('amountFuel')?.value;
      const mileage = this.kardexFuelForm.get('mileage')?.value;
      const dutyManager = this.kardexFuelForm.get('dutyManager')?.value;

      let kardexFuel = new KardexFuel();
      kardexFuel.idTruckFleet = idTruckFleet;
      kardexFuel.date = this.pipe.transform(date, 'yyyy-MM-dd');
      kardexFuel.amountFuel = amountFuel;
      kardexFuel.mileage = mileage;
      kardexFuel.dutyManager = dutyManager;

      console.log(kardexFuel);

      if (id == '0') {
        this.registerKardexFuel(kardexFuel);
      } else {
        kardexFuel.id = id;
        this.updateKardexFuel(kardexFuel);
      }

      this.new = false;
      this.textButton = "Registrar";
      this.clearControl();
    }
  }

  clearControl() {
    this.kardexFuelForm.controls['date'].setValue("");
    this.kardexFuelForm.controls['amountFuel'].setValue("");
    this.kardexFuelForm.controls['mileage'].setValue("");
    this.kardexFuelForm.controls['dutyManager'].setValue("");
    this.kardexFuelForm.controls['id'].setValue("0");
  }
  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any) {
    this.new = true;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    var listData = this.kardexFuels.filter((data: { id: any; }) => data.id === id);
    this.kardexFuelForm.controls['id'].setValue(listData[0].id);
    this.kardexFuelForm.controls['date'].setValue(this.pipe.transform(listData[0].date, 'yyyy-MM-dd'));
    this.kardexFuelForm.controls['amountFuel'].setValue(listData[0].amountFuel);
    this.kardexFuelForm.controls['mileage'].setValue(listData[0].mileage);
    this.kardexFuelForm.controls['dutyManager'].setValue(listData[0].dutyManager);
    this.textButton = "Actualizar";
  }

  listKardexFuels() {
    this.service.listKardexFuels()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.kardexFuelsResponse = response.datos.kardexFuels;
              this.service.paginationTable(this.kardexFuelsResponse);
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
              this.service.paginationTable([]);
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
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

  listKardexFuelsByIdTruckFleet(id) {
    this.service.listByIdTruckFleet(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.kardexFuelsResponse = response.datos.kardexFuels;
              this.service.paginationTable(this.kardexFuelsResponse);
            } else {
              this.service.paginationTable([]);
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
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

  registerKardexFuel(kardexFuel) {
    this.service.registerKardexFuel(kardexFuel)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              Swal.fire(
                '¡Registrado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              this.listKardexFuelsByIdTruckFleet(this.idTruckFleet);
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
              title: "Ocurrio un error",
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

  updateKardexFuel(kardexFuel) {
    this.service.updateKardexFuel(kardexFuel)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listKardexFuelsByIdTruckFleet(this.idTruckFleet);
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
              title: "Ocurrio un error",
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

  deleteKardexFuel(id) {
    console.log(id);
    this.service.deleteKardexFuel(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.meta.mensajes[0].codigo == '0') {
              Swal.fire(
                '¡Eliminado!',
                'Su archivo ha sido eliminado.',
                'success'
              );

              this.listKardexFuelsByIdTruckFleet(this.idTruckFleet);
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
              title: "Ocurrio un error",
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
