import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { TruckFleet } from '../models/truck-fleet.model';
import { TruckFleetService } from '../services/truck-fleet.service';

@Component({
  selector: 'app-truck-fleet',
  templateUrl: './truck-fleet.component.html',
  styleUrls: ['./truck-fleet.component.scss'],
  providers: [TruckFleetService, DecimalPipe]
})
export class TruckFleetComponent implements OnInit {

  // bread crumb items
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

  constructor(public service: TruckFleetService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder) {
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
      vanPlate: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      volume: ['', [Validators.required]],
      fabricationDate: ['', [Validators.required]],
      tonNumber: ['', [Validators.required]],
      axes: ['', [Validators.required]],
      model: ['', [Validators.required]],
      highWideLong: ['', [Validators.required]],
      fleetType: ['', [Validators.required]]
    });

    this.truckFleetsList.subscribe(x => {
      this.content = this.truckFleets;
      this.truckFleets = Object.assign([], x);
    });

    this.listTruckFleets();
  }

  /**
     * Open modal
     * @param content modal content
     */
  openViewModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
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

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.truckFleetForm.controls;
  }

  /**
  * Save user
  */
  saveUser() {
    this.submitted = true
    if (this.truckFleetForm.valid) {
      this.pipe = new DatePipe('en-US');
      const idProvider = 7;//this.truckFleetForm.get('idProvider')?.value;
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
      truckFleet.idProvider = idProvider;
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
      const id = this.truckFleetForm.get('id')?.value;
      console.log(truckFleet);
      console.log(id);
      if (id == '0') {
        this.registerTruckFleet(truckFleet);
      } else {
        truckFleet.id = id;
        this.updateTruckFleet(truckFleet);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.truckFleetForm.reset();
      }, 2000);

    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar Flota';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
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
  }

  listTruckFleets() {
    this.service.listTruckFleets()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.truckFleetDtoList;
              this.service.paginationTable(this.test);
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

  updateTruckFleet(truckFleet) {
    this.service.updateTruckFleet(truckFleet)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
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
