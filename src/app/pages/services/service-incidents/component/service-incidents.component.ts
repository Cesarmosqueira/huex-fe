import { Component, Input, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {ServiceIncidents} from "../models/service-incidents.model";
import {ServiceIncidentsService} from "../services/service-incidents.service";
import { Tracking } from '../../tracking/models/tracking.model';

@Component({
  selector: 'app-service-incidents',
  templateUrl: './service-incidents.component.html',
  styleUrls: ['./service-incidents.component.scss']
})
export class ServiceIncidentsComponent implements OnInit {

  @Input() idTracking: number;
  
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  serviceIncidentsForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  serviceIncidents?: any;
  test: ServiceIncidents[] = [];
  serviceIncidentsList!: Observable<ServiceIncidents[]>;
  total: Observable<number>;
  pipe: any;

  new = false;
  textButton = "Registrar";

  constructor(public service: ServiceIncidentsService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.serviceIncidentsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Incidentes servicios', active: true }];

    /**
     * Form Validation
     */
    this.serviceIncidentsForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      grt: ['', [Validators.required]],
      grr: ['', [Validators.required]],
      order: ['', [Validators.required]],
      quantityUnits: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.serviceIncidentsList.subscribe(x => {
      this.content = this.serviceIncidents;
      this.serviceIncidents = Object.assign([], x);
    });

    this.listServiceIncidentsByIdTracking(this.idTracking);
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
          this.deleteServiceIncidents(id);
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

  openModal(value) {
    this.new = value;
  }

  cancel(){
    this.clearControl();
    this.submitted = false;
    this.new = false;
    this.textButton = "Registrar";
  }

  clearControl(){
    this.serviceIncidentsForm.controls['id'].setValue("0");
    this.serviceIncidentsForm.controls['grt'].setValue("");
    this.serviceIncidentsForm.controls['grr'].setValue("");
    this.serviceIncidentsForm.controls['order'].setValue("");
    this.serviceIncidentsForm.controls['quantityUnits'].setValue("");
    this.serviceIncidentsForm.controls['observation'].setValue("");
  }
  
  get form() {
    return this.serviceIncidentsForm.controls;
  }


  saveUser() {
    this.submitted = true
    if (this.serviceIncidentsForm.valid) {
      this.pipe = new DatePipe('en-US');
      const grt = this.serviceIncidentsForm.get('grt')?.value;
      const grr = this.serviceIncidentsForm.get('grr')?.value;
      const order = this.serviceIncidentsForm.get('order')?.value;
      const quantityUnits = this.serviceIncidentsForm.get('quantityUnits')?.value;
      const observation = this.serviceIncidentsForm.get('observation')?.value;
      let tracking = new Tracking();
      tracking.id = this.idTracking;


      let serviceIncidents = new ServiceIncidents();
      serviceIncidents.trackingService = tracking;
      serviceIncidents.grt = grt;
      serviceIncidents.grr = grr;
      serviceIncidents.order = order;
      serviceIncidents.quantityUnits = quantityUnits;
      serviceIncidents.observation = observation;

      const id = this.serviceIncidentsForm.get('id')?.value;
      if (id == '0') {
        this.registerServiceIncidents(serviceIncidents);
      } else {
        serviceIncidents.id = id;
        this.updateServiceIncidents(serviceIncidents);
      }

      this.new = false;
      this.textButton = "Registrar";
      this.clearControl();

    }
  }

  editDataGet(id: any) {
    this.new = true;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    var listData = this.serviceIncidents.filter((data: { id: any; }) => data.id === id);
    this.serviceIncidentsForm.controls['id'].setValue(listData[0].id);
    this.serviceIncidentsForm.controls['grt'].setValue(listData[0].grt);
    this.serviceIncidentsForm.controls['grr'].setValue(listData[0].grr);
    this.serviceIncidentsForm.controls['order'].setValue(listData[0].order);
    this.serviceIncidentsForm.controls['quantityUnits'].setValue(listData[0].quantityUnits);
    this.serviceIncidentsForm.controls['observation'].setValue(listData[0].observation);
    this.textButton = "Actualizar";
  }

  listServiceIncidentsByIdTracking(id) {
    this.service.listServiceIncidentsByIdTracking(id)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.serviceIncidents;
              this.service.paginationTable(this.test);
            }
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error, comuniquese con el encargado",
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

  registerServiceIncidents(serviceIncidents) {
    this.service.registerServiceIncidents(serviceIncidents)
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
              this.listServiceIncidentsByIdTracking(this.idTracking);
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
              title: "Ocurrio un error, comuniquese con el encargado",
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

  updateServiceIncidents(serviceIncidents) {
    this.service.updateServiceIncidents(serviceIncidents)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listServiceIncidentsByIdTracking(this.idTracking);
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
              title: "Ocurrio un error, comuniquese con el encargado",
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

  deleteServiceIncidents(id) {
    this.service.deleteServiceIncidents(id)
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
              this.listServiceIncidentsByIdTracking(this.idTracking);
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
              title: "Ocurrio un error, comuniquese con el encargado",
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
