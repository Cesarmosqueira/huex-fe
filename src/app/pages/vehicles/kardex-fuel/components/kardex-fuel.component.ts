import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { FuelSupply } from 'src/app/pages/providers/fuel-supply/models/fuel-supply.model';
import { FuelSupplyService } from 'src/app/pages/providers/fuel-supply/services/fuel-supply.service';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { TruckFleet } from '../../truck-fleet/models/truck-fleet.model';
import { TruckFleetService } from '../../truck-fleet/services/truck-fleet.service';
import { KardexFuel } from '../models/kardex-fuel';
import { KardexFuelService } from '../services/kardex-fuel.service';

@Component({
  selector: 'app-kardex-fuel',
  templateUrl: './kardex-fuel.component.html',
  styleUrls: ['./kardex-fuel.component.scss']
})
export class KardexFuelComponent implements OnInit {

  @Input() idTruckFleet: number;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  kardexFuelForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  truckFleets: TruckFleet[] = [];
  selectTruckFleets = null;
  selectFuelSupplys = null;
  fuelSupplys: FuelSupply[] = [];

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
    private modalService: NgbModal,
    private serviceTruckFleet: TruckFleetService,
    private formBuilder: UntypedFormBuilder,
    private fuelSupplyService: FuelSupplyService) {
    this.kardexFuelsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Vehiculos' }, { label: 'Kardex Combustible', active: true }];


    this.kardexFuelForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      date: ['', [Validators.required]],
      amountFuel: ['', [Validators.required]],
      mileage: ['', [Validators.required]],
      dutyManager: ['', [Validators.required]],
      truckFleet: ['', [Validators.required]],
      fuelSupply: ['', [Validators.required]]
    });

    this.kardexFuelsList.subscribe(x => {
      this.content = this.kardexFuels;
      this.kardexFuels = Object.assign([], x);
    });
    this.listFuelSupply();
    this.listTruckFleet();
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

  openModal(content: any) {
    this.clearControl();
    this.submitted = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
    this.selectTruckFleets = null;
    this.selectFuelSupplys = null;

    this.modalService.open(content, ngbModalOptions);
  }

  get form() {
    return this.kardexFuelForm.controls;
  }

  saveKardexFuel() {
    this.submitted = true
    if (this.kardexFuelForm.valid) {
      this.pipe = new DatePipe('en-US');
      const id = this.kardexFuelForm.get('id')?.value;
      const date = this.kardexFuelForm.get('date')?.value;
      const amountFuel = this.kardexFuelForm.get('amountFuel')?.value;
      const mileage = this.kardexFuelForm.get('mileage')?.value;
      const dutyManager = this.kardexFuelForm.get('dutyManager')?.value;

      let kardexFuel = new KardexFuel();
      let fuelSupply = new FuelSupply();

      fuelSupply.id = this.selectFuelSupplys.id;
      kardexFuel.tractPlate = this.selectTruckFleets.tractPlate;
      kardexFuel.fuelSupply = fuelSupply;
      kardexFuel.date = this.pipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.sssZ');
      kardexFuel.amountFuel = amountFuel;
      kardexFuel.mileage = mileage;
      kardexFuel.dutyManager = dutyManager;
      kardexFuel.operation = "S";
      kardexFuel.unitPrice = this.selectFuelSupplys.gallonPrice;

      if (id == '0') {
        this.registerKardexFuel(kardexFuel);
      } else {
        kardexFuel.id = id;
        this.updateKardexFuel(kardexFuel);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.kardexFuelForm.reset();
      }, 2000);

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
    //this.selectTruckFleets = listData[0].truckFleet;
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
              console.log(this.kardexFuelsResponse);
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

  

  registerKardexFuel(kardexFuel) {
    this.service.registerKardexFuel(kardexFuel)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
                timer: 2000
              });
              this.listKardexFuels();
              this.listFuelSupply();
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
              this.listTruckFleet();
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

              this.listKardexFuels();
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

  listTruckFleet() {
    this.serviceTruckFleet.listTruckFleets()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.truckFleets = response.datos.truckFleets;
            } else {
              Swal.fire({
                icon: config.WARNING,
                title: response.meta.mensajes[0].mensaje,
                showConfirmButton: false,
              });
            }
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

  listFuelSupply() {
    this.fuelSupplyService.lisFuelSupplyAvailable()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.fuelSupplys = response.datos.fuelsSupply;
              console.log(this.fuelSupplys);
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
