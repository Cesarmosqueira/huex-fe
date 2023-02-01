import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { MaintenanceOil } from '../models/maintenance-oil.model';
import { MaintenanceOilService } from '../services/maintenance-oil.service';
import {TruckFleet} from "../../truck-fleet/models/truck-fleet.model";
import {TruckFleetService} from "../../truck-fleet/services/truck-fleet.service";

@Component({
  selector: 'app-maintenance-oil',
  templateUrl: './maintenance-oil.component.html',
  styleUrls: ['./maintenance-oil.component.scss']
})
export class MaintenanceOilComponent implements OnInit {
  idTruckFleetOuput: number=0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  maintenanceOilForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  maintenanceOils?: any;
  maintenanceOilsResponse: MaintenanceOil[] = [];
  maintenanceOilsList!: Observable<MaintenanceOil[]>;
  total: Observable<number>;
  pipe: any;

  truckFleets:TruckFleet[]=[];
  selectTruckFleets=null;



  image: any;
  file: File = null;
  new = false;
  textButton = "Registrar";

  constructor(public service: MaintenanceOilService,
    private serviceTruckFleet:TruckFleetService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal) {
    this.maintenanceOilsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Vehiculos' }, { label: 'Mantenimiento Aceite', active: true }];


    this.maintenanceOilForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      truckFleet: ['', [Validators.required]],
      changeType: ['', [Validators.required]],
      place: ['', [Validators.required]],
      dateChange: ['', [Validators.required]],
      kmLast: ['', [Validators.required]],
      kmCurrent: ['', [Validators.required]],
      kmNext: ['', [Validators.required]],
      status: ['', [Validators.required]],
      differences: ['', [Validators.required]]
    });

    this.maintenanceOilsList.subscribe(x => {
      this.content = this.maintenanceOils;
      this.maintenanceOils = Object.assign([], x);
    });
    this.idTruckFleetOuput = 0;
    console.log(this.idTruckFleetOuput);
    this.listMaintenanceOils();
    this.listTruckFleet();
  }
//prueba
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
          this.deleteMaintenanceOil(id);
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
      size: 'lg'
    };
    this.selectTruckFleets=null;
    this.modalService.open(content, ngbModalOptions);
  }

  get form() {
    return this.maintenanceOilForm.controls;
  }

  saveMaintenanceOil() {
    this.submitted = true
    if (this.maintenanceOilForm.valid) {
      this.pipe = new DatePipe('en-US');
      const truckFleetId = this.selectTruckFleets.id;
      const changeType = this.maintenanceOilForm.get('changeType')?.value;
      const place = this.maintenanceOilForm.get('place')?.value;
      const dateChange = this.maintenanceOilForm.get('dateChange')?.value;
      const kmLast = this.maintenanceOilForm.get('kmLast')?.value;
      const kmCurrent = this.maintenanceOilForm.get('kmCurrent')?.value;
      const kmNext = this.maintenanceOilForm.get('kmNext')?.value;
      const status =  this.maintenanceOilForm.get('status')?.value;
      const differences = this.maintenanceOilForm.get('differences')?.value;
      const myDate = new Date();
      let maintenanceOil = new MaintenanceOil();
      let truckFleet=new TruckFleet();
      truckFleet.id=truckFleetId;
      maintenanceOil.truckFleet = truckFleet;
      maintenanceOil.changeType = changeType;
      maintenanceOil.place = place;
      maintenanceOil.dateChange = this.pipe.transform(dateChange, 'yyyy-MM-dd');
      maintenanceOil.kmLast = kmLast;
      maintenanceOil.kmCurrent = kmCurrent;
      maintenanceOil.kmNext = kmNext;
      maintenanceOil.status = Number(status);
      maintenanceOil.differences = differences;
      maintenanceOil.dateCurrent = this.pipe.transform(myDate, 'yyyy-MM-dd');

      const id = this.maintenanceOilForm.get('id')?.value;
      console.log(maintenanceOil);
      console.log(id);
      if (id == '0') {
        this.registerMaintenanceOil(maintenanceOil);
      } else {
        maintenanceOil.id = id;
        this.updateMaintenanceOil(maintenanceOil);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.maintenanceOilForm.reset();
      }, 2000);

      this.clearControl();
    }
  }

  clearControl() {
    this.maintenanceOilForm.controls['truckFleet'].setValue("");
    this.maintenanceOilForm.controls['changeType'].setValue("");
    this.maintenanceOilForm.controls['place'].setValue("");
    this.maintenanceOilForm.controls['dateChange'].setValue("");
    this.maintenanceOilForm.controls['kmLast'].setValue("");
    this.maintenanceOilForm.controls['kmCurrent'].setValue("");
    this.maintenanceOilForm.controls['kmNext'].setValue("");
    this.maintenanceOilForm.controls['status'].setValue("");
    this.maintenanceOilForm.controls['differences'].setValue("");
    this.maintenanceOilForm.controls['id'].setValue("0");
  }

  editDataGet(id: any, content) {
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    };

    this.modalService.open(content, ngbModalOptions);
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar Mantenimiento Aceite';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.maintenanceOils.filter((data: { id: any; }) => data.id === id);
    this.maintenanceOilForm.controls['id'].setValue(listData[0].id);
    this.maintenanceOilForm.controls['truckFleet'].setValue(listData[0].truckFleet.id);
    this.maintenanceOilForm.controls['changeType'].setValue(listData[0].changeType);
    this.maintenanceOilForm.controls['place'].setValue(listData[0].place);
    this.maintenanceOilForm.controls['dateChange'].setValue(this.pipe.transform(listData[0].dateChange, 'yyyy-MM-dd'));
    this.maintenanceOilForm.controls['kmLast'].setValue(listData[0].kmLast);
    this.maintenanceOilForm.controls['kmCurrent'].setValue(listData[0].kmCurrent);
    this.maintenanceOilForm.controls['kmNext'].setValue(listData[0].kmNext);
    this.maintenanceOilForm.controls['status'].setValue(listData[0].status);
    this.maintenanceOilForm.controls['differences'].setValue(listData[0].differences);
    this.selectTruckFleets=listData[0].truckFleet.tractPlate;
    this.idTruckFleetOuput=id;
  }

  listMaintenanceOils() {
    this.service.listMaintenanceOils()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.maintenanceOilsResponse = response.datos.maintenancesOil;
              this.service.paginationTable(this.maintenanceOilsResponse);
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

  registerMaintenanceOil(maintenanceOil) {
    this.service.registerMaintenanceOil(maintenanceOil)
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
              this.listMaintenanceOils();
              //this.listMaintenanceOilsByIdTruckFleet(this.idTruckFleet);
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

  updateMaintenanceOil(maintenanceOil) {
    this.service.updateMaintenanceOil(maintenanceOil)
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
              this.listMaintenanceOils();
              //this.listMaintenanceOilsByIdTruckFleet(this.idTruckFleet);
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

  deleteMaintenanceOil(id) {
    console.log(id);
    this.service.deleteMaintenanceOil(id)
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
                 this.listMaintenanceOils();
              //this.listMaintenanceOilsByIdTruckFleet(this.idTruckFleet);
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
              console.log(this.truckFleets);
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



}
