import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {ServiceIncidents} from "../models/service-incidents.model";
import {ServiceIncidentsService} from "../services/service-incidents.service";

@Component({
  selector: 'app-service-incidents',
  templateUrl: './service-incidents.component.html',
  styleUrls: ['./service-incidents.component.scss']
})
export class ServiceIncidentsComponent implements OnInit {

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
      trackingServiceId: ['', [Validators.required]],
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

    this.listServiceIncidents();
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
    return this.serviceIncidentsForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.serviceIncidentsForm.valid) {
      this.pipe = new DatePipe('en-US');
      const trackingServiceId = 2;//this.serviceIncidentsForm.get('trackingServiceId')?.value;
      const grt = this.serviceIncidentsForm.get('grt')?.value;
      const grr = this.serviceIncidentsForm.get('grr')?.value;
      const order = this.serviceIncidentsForm.get('order')?.value;
      const quantityUnits = this.serviceIncidentsForm.get('quantityUnits')?.value;
      const observation = this.serviceIncidentsForm.get('observation')?.value;



      let serviceIncidents = new ServiceIncidents();
      serviceIncidents.trackingServiceId = trackingServiceId;
      serviceIncidents.grt = grt;
      serviceIncidents.grr = grr;
      serviceIncidents.order = order;
      serviceIncidents.quantityUnits = quantityUnits;
      serviceIncidents.observation = observation;

      const id = this.serviceIncidentsForm.get('id')?.value;
      console.log(serviceIncidents);
      console.log(id);
      if (id == '0') {
        this.registerServiceIncidents(serviceIncidents);
      } else {
        serviceIncidents.id = id;
        this.updateServiceIncidents(serviceIncidents);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.serviceIncidentsForm.reset();
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
    modelTitle.innerHTML = 'Actualizar Incidente servicio';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.serviceIncidents.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.serviceIncidentsForm.controls['id'].setValue(listData[0].id);
    this.serviceIncidentsForm.controls['trackingServiceId'].setValue(listData[0].trackingServiceId);
    this.serviceIncidentsForm.controls['grt'].setValue(listData[0].grt);
    this.serviceIncidentsForm.controls['grr'].setValue(listData[0].grr);
    this.serviceIncidentsForm.controls['order'].setValue(listData[0].order);
    this.serviceIncidentsForm.controls['quantityUnits'].setValue(listData[0].quantityUnits);
    this.serviceIncidentsForm.controls['observation'].setValue(listData[0].observation);
  }

  listServiceIncidents() {
    this.service.listServiceIncidents()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.serviceIncidents;
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
              this.listServiceIncidents();
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
              this.listServiceIncidents();
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
              this.listServiceIncidents();
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
