import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ServiceIncidents} from "../../../services/service-incidents/models/service-incidents.model";
import {Observable} from "rxjs";
import {Tracking} from "../../../services/tracking/models/tracking.model";
import {ServiceIncidentsService} from "../../../services/service-incidents/services/service-incidents.service";
import {TrackingService} from "../../../services/tracking/services/tracking.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {TruckFleet} from "../../truck-fleet/models/truck-fleet.model";
import {FuelControl} from "../models/fuel-control.model";
import {FuelControlService} from "../services/fuel-control.service";

@Component({
  selector: 'app-fuel-control',
  templateUrl: './fuel-control.component.html',
  styleUrls: ['./fuel-control.component.scss']
})
export class FuelControlComponent implements OnInit {


  idFuelControlOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  fuelControlForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  fuelControl?: any;
  test: FuelControl[] = [];
  fuelControlList!: Observable<FuelControl[]>;
  total: Observable<number>;
  pipe: any;

  tracking:Tracking[]=[];
  selectTracking=null;


  constructor(public service: FuelControlService,
              private serviceTracking:TrackingService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.fuelControlList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Control petroleo', active: true }];

    /**
     * Form Validation
     */
    this.fuelControlForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      trackingService: [''],
      firstPlace: [''],
      firstQuantity: [''],
      secondPlace: [''],
      secondQuantity: [''],
      thirdPlace: [''],
      thirdQuantity: [''],
      fourthPlace: [''],
      forthQuantity: [''],
      fifthPlace: [''],
      fifthQuantity: [''],
      sixthPlace: [''],
      sixthQuantity:[''],
      totalGallons: [''],
      target: [''],
      difference: [''],
      observation: [''],

      btnSave: []
    });

    this.fuelControlList.subscribe(x => {
      this.content = this.fuelControl;
      this.fuelControl = Object.assign([], x);
    });
    this.idFuelControlOuput = 0;

    this.listFuelControl();
    this.listTracking();
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
          this.deleteFuelControl(id);
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
    this.clear();
    this.submitted = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    };
    this.selectTracking=null;
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.fuelControlForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.fuelControlForm.valid) {
      this.pipe = new DatePipe('en-US');
      const trackingServiceId=this.selectTracking.id;
      const firstPlace = this.fuelControlForm.get('firstPlace')?.value;
      const firstQuantity = this.fuelControlForm.get('firstQuantity')?.value;
      const secondPlace = this.fuelControlForm.get('secondPlace')?.value;
     const secondQuantity = this.fuelControlForm.get('secondQuantity')?.value;
      const thirdPlace = this.fuelControlForm.get('thirdPlace')?.value;
      const thirdQuantity = this.fuelControlForm.get('thirdQuantity')?.value;
      const fourthPlace = this.fuelControlForm.get('fourthPlace')?.value;
      const fourthQuantity = this.fuelControlForm.get('forthQuantity')?.value;
      const fifthPlace = this.fuelControlForm.get('fifthPlace')?.value;
      const fifthQuantity = this.fuelControlForm.get('fifthQuantity')?.value;
      const sixthPlace = this.fuelControlForm.get('sixthPlace')?.value;
      const sixthQuantity = this.fuelControlForm.get('sixthQuantity')?.value;
      //const totalGallons = this.fuelControlForm.get('totalGallons')?.value;
      const target = this.fuelControlForm.get('target')?.value;
      //const difference = this.fuelControlForm.get('difference')?.value;
      let totalGallons=secondQuantity+thirdQuantity+fourthQuantity+fifthQuantity+sixthQuantity;
      let difference=target-totalGallons;
      const observation = this.fuelControlForm.get('observation')?.value;

      let fuelControl = new FuelControl();
      let tracking=new Tracking();
      tracking.id=trackingServiceId;
      fuelControl.trackingService = tracking;
      fuelControl.firstPlace = firstPlace;
      fuelControl.firstQuantity=firstQuantity;
      fuelControl.secondPlace=secondPlace;
      fuelControl.secondQuantity=secondQuantity;
      fuelControl.thirdPlace=thirdPlace;
      fuelControl.thirdQuantity=thirdQuantity;
      fuelControl.fourthPlace=fourthPlace;
      fuelControl.forthQuantity=fourthQuantity;
      fuelControl.fifthPlace=fifthPlace;
      fuelControl.fifthQuantity=fifthQuantity;
      fuelControl.sixthPlace=sixthPlace;
      fuelControl.sixthQuantity=sixthQuantity;
      fuelControl.totalGallons=totalGallons;
      fuelControl.target=target;
      fuelControl.difference=difference;
      fuelControl.observation=observation;


      const id = this.fuelControlForm.get('id')?.value;

      if (id == '0') {
        this.registerFuelControl(fuelControl);
      } else {
        fuelControl.id = id;
        this.updateFuelControl(fuelControl);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.fuelControlForm.reset();
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
    this.enableInputs();

    this.modalService.open(content, { size: 'xl', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar proveedores';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.fuelControl.filter((data: { id: any; }) => data.id === id);


    this.fuelControlForm.controls['id'].setValue(listData[0].id);
    this.fuelControlForm.controls['firstPlace'].setValue(listData[0].firstPlace);
    this.fuelControlForm.controls['firstQuantity'].setValue(listData[0].firstQuantity);
    this.fuelControlForm.controls['secondPlace'].setValue(listData[0].secondPlace);
    this.fuelControlForm.controls['secondQuantity'].setValue(listData[0].secondQuantity);
    this.fuelControlForm.controls['thirdPlace'].setValue(listData[0].thirdPlace);
    this.fuelControlForm.controls['thirdQuantity'].setValue(listData[0].thirdQuantity);
    this.fuelControlForm.controls['fourthPlace'].setValue(listData[0].fourthPlace);
    this.fuelControlForm.controls['forthQuantity'].setValue(listData[0].forthQuantity);
    this.fuelControlForm.controls['fifthPlace'].setValue(listData[0].fifthPlace);
    this.fuelControlForm.controls['fifthQuantity'].setValue(listData[0].fifthQuantity);
    this.fuelControlForm.controls['sixthPlace'].setValue(listData[0].sixthPlace);
    this.fuelControlForm.controls['sixthQuantity'].setValue(listData[0].sixthQuantity);
    this.fuelControlForm.controls['target'].setValue(listData[0].target);
    this.fuelControlForm.controls['observation'].setValue(listData[0].observation);

    let tracking = this.tracking.filter((data: { id: any; }) => data.id === listData[0].trackingService.id);
    this.selectTracking=tracking[0];

    this.idFuelControlOuput = id;
  }

  listFuelControl() {
    this.service.listFuelControl()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.fuelControlDto;
              this.service.paginationTable(this.test);
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

  registerFuelControl(fuelControl) {
    this.service.registerFuelControl(fuelControl)
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
              this.listFuelControl();
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

  updateFuelControl(fuelControl) {
    this.service.updateFuelControl(fuelControl)
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
              this.listFuelControl();
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
    this.fuelControlForm.controls['id'].setValue("0");
    this.fuelControlForm.controls['trackingService'].setValue(null);
    this.fuelControlForm.controls['firstPlace'].setValue("");
    this.fuelControlForm.controls['firstQuantity'].setValue("");
    this.fuelControlForm.controls['secondPlace'].setValue("");
    this.fuelControlForm.controls['secondQuantity'].setValue("");
    this.fuelControlForm.controls['thirdPlace'].setValue("");
    this.fuelControlForm.controls['thirdQuantity'].setValue("");
    this.fuelControlForm.controls['fourthPlace'].setValue("");
    this.fuelControlForm.controls['forthQuantity'].setValue("");
    this.fuelControlForm.controls['fifthPlace'].setValue("");
    this.fuelControlForm.controls['fifthQuantity'].setValue("");
    this.fuelControlForm.controls['sixthPlace'].setValue("");
    this.fuelControlForm.controls['sixthQuantity'].setValue("");
    this.fuelControlForm.controls['target'].setValue("");
    this.fuelControlForm.controls['observation'].setValue("");



  }

  enableInputs() {
    this.fuelControlForm.controls['id'].enable();
    this.fuelControlForm.controls['trackingService'].enable();
    this.fuelControlForm.controls['firstPlace'].enable();
    this.fuelControlForm.controls['firstQuantity'].enable();
    this.fuelControlForm.controls['secondPlace'].enable();
    this.fuelControlForm.controls['secondQuantity'].enable();
    this.fuelControlForm.controls['thirdPlace'].enable();
    this.fuelControlForm.controls['thirdQuantity'].enable();
    this.fuelControlForm.controls['fourthPlace'].enable();
    this.fuelControlForm.controls['forthQuantity'].enable();
    this.fuelControlForm.controls['fifthPlace'].enable();
    this.fuelControlForm.controls['fifthQuantity'].enable();
    this.fuelControlForm.controls['sixthPlace'].enable();
    this.fuelControlForm.controls['sixthQuantity'].enable();
    this.fuelControlForm.controls['target'].enable();
    this.fuelControlForm.controls['observation'].enable();


  }


  deleteFuelControl(id) {
    this.service.deleteFuelControl(id)
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
              this.listFuelControl();
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

  listTracking() {
    this.serviceTracking.listTrackings()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.tracking = response.datos.trackingsService;
              this.tracking.forEach(element => {
                let tru = new TruckFleet();
                tru = element.truckFleet;
                tru.name = element.dateService+"/"+element.truckFleet.tractPlate+"/"+ element.rate.customer.socialReason+"/"+element.rate.route.routeEnd;
                element.truckFleet = tru;
              });
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
