import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { MaintenanceTire } from '../models/maintenance-tire.model';
import { MaintenanceTireService } from '../services/maintenance-tire.service';
import {TruckFleet} from "../../truck-fleet/models/truck-fleet.model";
import {TruckFleetService} from "../../truck-fleet/services/truck-fleet.service";

@Component({
  selector: 'app-maintenance-tire',
  templateUrl: './maintenance-tire.component.html',
  styleUrls: ['./maintenance-tire.component.scss']
})
export class MaintenanceTireComponent implements OnInit {

  idMaintenanceTireOuput: number=0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  maintenanceTireForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  maintenanceTires?: any;
  maintenanceTiresResponse: MaintenanceTire[] = [];
  maintenanceTiresList!: Observable<MaintenanceTire[]>;
  total: Observable<number>;
  pipe: any;

  truckFleets:TruckFleet[]=[];
  selectTruckFleets=null;

  image: any;
  file: File = null;
  new = false;
  textButton = "Registrar";

  constructor(public service: MaintenanceTireService,
    private serviceTruckFleet:TruckFleetService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal) {
    this.maintenanceTiresList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Vehiculos' }, { label: 'Mantenimiento Llanta', active: true }];

    this.maintenanceTireForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      truckFleet: ['', [Validators.required]],
      dateReview: ['', [Validators.required]],
      dateRenewal: ['', [Validators.required]],
      statusTire: ['', [Validators.required]]
    });

    this.maintenanceTiresList.subscribe(x => {
      this.content = this.maintenanceTires;
      this.maintenanceTires = Object.assign([], x);
    });
    this.idMaintenanceTireOuput = 0;
    console.log(this.idMaintenanceTireOuput);
    this.listTruckFleet();
    this.listMaintenanceTires();
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
          this.deleteMaintenanceTire(id);
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

  cancel(){
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

    this.modalService.open(content, ngbModalOptions);
  }

  get form() {
    return this.maintenanceTireForm.controls;
  }

  saveMaintenanceTire() {
    this.submitted = true
    if (this.maintenanceTireForm.valid) {
      this.pipe = new DatePipe('en-US');
      const id = this.maintenanceTireForm.get('id')?.value;
      const truckFleetId = this.selectTruckFleets.id;
      const dateRenewal = this.maintenanceTireForm.get('dateRenewal')?.value;
      const dateReview = this.maintenanceTireForm.get('dateReview')?.value;
      const statusTire = this.maintenanceTireForm.get('statusTire')?.value;

      let maintenanceTire = new MaintenanceTire();
      let truckFleet=new TruckFleet();

      truckFleet.id=truckFleetId;
      maintenanceTire.truckFleet = truckFleet;
      maintenanceTire.dateRenewal = this.pipe.transform(dateRenewal, 'yyyy-MM-dd');
      maintenanceTire.dateReview = this.pipe.transform(dateReview, 'yyyy-MM-dd');
      maintenanceTire.statusTire = statusTire;

      console.log(maintenanceTire);

      if (id == '0') {
        this.registerMaintenanceTire(maintenanceTire);
      } else {
        maintenanceTire.id = id;
        this.updateMaintenanceTire(maintenanceTire);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.maintenanceTireForm.reset();
      }, 2000);


      this.clearControl();
    }
  }

  clearControl(){
    this.maintenanceTireForm.controls['truckFleet'].setValue("");
    this.maintenanceTireForm.controls['dateRenewal'].setValue("");
    this.maintenanceTireForm.controls['dateReview'].setValue("");
    this.maintenanceTireForm.controls['statusTire'].setValue("");
    this.maintenanceTireForm.controls['id'].setValue("0");
  }
  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content) {
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };

    this.modalService.open(content, ngbModalOptions);
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar Mantenimiento Llantas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.maintenanceTires.filter((data: { id: any; }) => data.id === id);
    this.maintenanceTireForm.controls['id'].setValue(listData[0].id);
    this.maintenanceTireForm.controls['truckFleet'].setValue(listData[0].truckFleet.id);
    this.maintenanceTireForm.controls['dateReview'].setValue(this.pipe.transform(listData[0].dateReview, 'yyyy-MM-dd'));
    this.maintenanceTireForm.controls['dateRenewal'].setValue(this.pipe.transform(listData[0].dateRenewal, 'yyyy-MM-dd'));
    this.maintenanceTireForm.controls['statusTire'].setValue(listData[0].statusTire);
    this.selectTruckFleets=listData[0].truckFleet.tractPlate;
    this.idMaintenanceTireOuput=id;

  }

  listMaintenanceTires() {
    this.service.listMaintenanceTires()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.maintenanceTiresResponse = response.datos.maintenancesTire;
              this.service.paginationTable(this.maintenanceTiresResponse);
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


  registerMaintenanceTire(maintenanceTire) {
    this.service.registerMaintenanceTire(maintenanceTire)
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
              this.listMaintenanceTires();
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

  updateMaintenanceTire(maintenanceTire) {
    this.service.updateMaintenanceTire(maintenanceTire)
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
              this.listMaintenanceTires();
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

  deleteMaintenanceTire(id) {
    console.log(id);
    this.service.deleteMaintenanceTire(id)
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
              this.listMaintenanceTires();

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
