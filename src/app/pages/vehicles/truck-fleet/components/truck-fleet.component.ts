import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Providers } from 'src/app/pages/providers/provider/models/providers.model';
import { ProviderService } from 'src/app/pages/providers/provider/services/provider.service';
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

  idTruckFleetOuput: number = 0;
  newTruck = false;
  textButton = "Registrar";
  action = 0;

  breadCrumbItems: Array<{}>;
  term: any;

  truckFleetForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  truckFleets?: any;
  test: TruckFleet[] = [];
  truckFleetsList!: Observable<TruckFleet[]>;
  total: Observable<number>;
  pipe: any;
  providers: Providers[] = [];
  selectProvider = null;

  constructor(public service: TruckFleetService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private serviceProvider: ProviderService) {
    this.truckFleetsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Vehículos' }, { label: 'Flota de Camiones', active: true }];

    /**
     * Form Validation
     */
    this.truckFleetForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      idProvider: ['', [Validators.required]],
      tractPlate: ['', [Validators.required]],
      vanPlate: [''],
      brand: [''],
      volume: ['', [Validators.required]],
      fabricationDate: [''],
      tonNumber: [''],
      axes: [''],
      model: [''],
      highWideLong: [''],
      fleetType: ['',[Validators.required]],
      btnSave: []
    });

    this.truckFleetsList.subscribe(x => {
      this.content = this.truckFleets;
      this.truckFleets = Object.assign([], x);
    });
    this.idTruckFleetOuput = 0;
    this.listProviders();
    this.listTruckFleets();
  }

  openViewModal(content: any) {
    this.modalService.open(content, { centered: true });
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
          this.deleteTruckFleet(id);
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

  openModal(content: any) {
    this.action = 1;
    this.clear();
    this.submitted = false;
    this.newTruck = false;
    this.textButton = "Registrar";
    this.enableInputs();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    };
    this.modalService.open(content, ngbModalOptions);
    this.selectProvider = null;


  }

  get form() {
    return this.truckFleetForm.controls;
  }

  saveTruckFleet() {
    this.submitted = true;
    if (this.truckFleetForm.valid) {
      this.pipe = new DatePipe('en-US');
      const idProvider = this.selectProvider.id;
      const tractPlate = this.truckFleetForm.get('tractPlate')?.value;
      const vanPlate = this.truckFleetForm.get('vanPlate')?.value;
      const brand = this.truckFleetForm.get('brand')?.value;
      const volume = this.truckFleetForm.get('volume')?.value;
      const fabricationDate = this.truckFleetForm.get('fabricationDate')?.value;
      const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
      const tonNumber = this.truckFleetForm.get('tonNumber')?.value;
      const axes = this.truckFleetForm.get('axes')?.value;
      const model = this.truckFleetForm.get('model')?.value;
      const highWideLong = this.truckFleetForm.get('highWideLong')?.value;
      const fleetType = this.truckFleetForm.get('fleetType')?.value;

      let truckFleet = new TruckFleet();
      truckFleet.tractPlate = tractPlate;
      truckFleet.vanPlate = vanPlate;
      truckFleet.brand = brand;
      truckFleet.volume = volume;
      truckFleet.fabricationDate = fortmatFabricationDate;
      truckFleet.tonNumber = tonNumber;
      truckFleet.axes = axes;
      truckFleet.model = model;
      truckFleet.highWideLong = highWideLong;
      truckFleet.fleetType = fleetType;
      let provider = new Providers();
      provider.id = idProvider;
      truckFleet.provider = provider;
      const id = this.truckFleetForm.get('id')?.value;
      if (id == '0') {
        this.registerTruckFleet(truckFleet);
      } else {
        truckFleet.id = id;
        this.updateTruckFleet(truckFleet);
      }
    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    this.enableInputs();
    this.action = 2;
    this.newTruck = true;
    this.textButton = "Actualizar";
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    };
    this.modalService.open(content, ngbModalOptions);
    var listData = this.truckFleets.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.truckFleetForm.controls['id'].setValue(listData[0].id);
    this.truckFleetForm.controls['tractPlate'].setValue(listData[0].tractPlate);
    this.truckFleetForm.controls['vanPlate'].setValue(listData[0].vanPlate);
    this.truckFleetForm.controls['brand'].setValue(listData[0].brand);
    this.truckFleetForm.controls['volume'].setValue(listData[0].volume);
    this.truckFleetForm.controls['fabricationDate'].setValue(fortmatFabricationDate);
    this.truckFleetForm.controls['axes'].setValue(listData[0].axes);
    this.truckFleetForm.controls['model'].setValue(listData[0].model);
    this.truckFleetForm.controls['highWideLong'].setValue(listData[0].highWideLong);
    this.truckFleetForm.controls['fleetType'].setValue(listData[0].fleetType);
    this.truckFleetForm.controls['tonNumber'].setValue(listData[0].tonNumber);
    this.selectProvider = listData[0].provider;
    this.idTruckFleetOuput = id;
  }

  listTruckFleets() {
    this.service.listTruckFleets()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.truckFleets;
              this.service.paginationTable(this.test);
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

  registerTruckFleet(truckFleet) {
    this.service.registerTruckFleet(truckFleet)
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
              this.newTruck = true;
              this.action = 0;
              this.disableInputs();
              const truckFleetDto = response.datos.truckFleet;
              this.idTruckFleetOuput = truckFleetDto.id;
              this.listTruckFleets();
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

  updateTruckFleet(truckFleet) {
    this.service.updateTruckFleet(truckFleet)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              Swal.fire(
                '¡Actualizado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );
              this.listTruckFleets();
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

  clear() {
    this.truckFleetForm.controls['id'].setValue("0");
    this.truckFleetForm.controls['idProvider'].setValue(null);
    this.truckFleetForm.controls['tractPlate'].setValue("");
    this.truckFleetForm.controls['vanPlate'].setValue("");
    this.truckFleetForm.controls['brand'].setValue("");
    this.truckFleetForm.controls['volume'].setValue("");
    this.truckFleetForm.controls['fabricationDate'].setValue("");
    this.truckFleetForm.controls['axes'].setValue("");
    this.truckFleetForm.controls['model'].setValue("");
    this.truckFleetForm.controls['highWideLong'].setValue("");
    this.truckFleetForm.controls['fleetType'].setValue("");
    this.truckFleetForm.controls['tonNumber'].setValue("");
  }

  enableInputs() {
    this.truckFleetForm.controls['id'].enable();
    this.truckFleetForm.controls['idProvider'].enable();
    this.truckFleetForm.controls['tractPlate'].enable();
    this.truckFleetForm.controls['vanPlate'].enable();
    this.truckFleetForm.controls['brand'].enable();
    this.truckFleetForm.controls['volume'].enable();
    this.truckFleetForm.controls['fabricationDate'].enable();
    this.truckFleetForm.controls['axes'].enable();
    this.truckFleetForm.controls['model'].enable();
    this.truckFleetForm.controls['highWideLong'].enable();
    this.truckFleetForm.controls['fleetType'].enable();
    this.truckFleetForm.controls['tonNumber'].enable();
  }

  disableInputs() {
    this.truckFleetForm.controls['id'].disable();
    this.truckFleetForm.controls['idProvider'].disable();
    this.truckFleetForm.controls['tractPlate'].disable();
    this.truckFleetForm.controls['vanPlate'].disable();
    this.truckFleetForm.controls['brand'].disable();
    this.truckFleetForm.controls['volume'].disable();
    this.truckFleetForm.controls['fabricationDate'].disable();
    this.truckFleetForm.controls['axes'].disable();
    this.truckFleetForm.controls['model'].disable();
    this.truckFleetForm.controls['highWideLong'].disable();
    this.truckFleetForm.controls['fleetType'].disable();
    this.truckFleetForm.controls['tonNumber'].disable();
  }

  deleteTruckFleet(id) {
    this.service.deleteTruckFleet(id)
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
              this.listTruckFleets();
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

  listProviders() {
    this.serviceProvider.listProviders()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.providers = response.datos.providers;
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
