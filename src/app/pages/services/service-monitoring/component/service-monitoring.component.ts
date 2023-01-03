import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ServiceIncidents} from "../../service-incidents/models/service-incidents.model";
import {Observable} from "rxjs";
import {ServiceIncidentsService} from "../../service-incidents/services/service-incidents.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {ServiceMonitoring} from "../models/service-monitoring.model";
import {ServiceMonitoringService} from "../services/service-monitoring.service";

@Component({
  selector: 'app-service-monitoring',
  templateUrl: './service-monitoring.component.html',
  styleUrls: ['./service-monitoring.component.scss']
})
export class ServiceMonitoringComponent implements OnInit {


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  serviceMonitoringForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  serviceMonitoring?: any;
  test: ServiceMonitoring[] = [];
  serviceMonitoringList!: Observable<ServiceMonitoring[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: ServiceMonitoringService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.serviceMonitoringList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Monitoreo servicios', active: true }];

    /**
     * Form Validation
     */
    this.serviceMonitoringForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      idTrackingService: ['', [Validators.required]],
      dateHour: ['', [Validators.required]],
      status: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      photoMonitoring: ['', [Validators.required]],
    });

    this.serviceMonitoringList.subscribe(x => {
      this.content = this.serviceMonitoring;
      this.serviceMonitoring = Object.assign([], x);
    });

    this.listServiceMonitoring();
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
          this.deleteServiceMonitoring(id);
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
    return this.serviceMonitoringForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.serviceMonitoringForm.valid) {
      this.pipe = new DatePipe('en-US');
      const idTrackingService = 2;//this.serviceIncidentsForm.get('trackingServiceId')?.value;
      const dateHour = this.serviceMonitoringForm.get('dateHour')?.value;
      const status = this.serviceMonitoringForm.get('status')?.value;
      const observation = this.serviceMonitoringForm.get('observation')?.value;
      const photoMonitoring = this.serviceMonitoringForm.get('photoMonitoring')?.value;



      let serviceMonitoring = new ServiceMonitoring();
      serviceMonitoring.idTrackingService = idTrackingService;
      serviceMonitoring.dateHour = dateHour;
      serviceMonitoring.status = status;
      serviceMonitoring.observation = observation;
      serviceMonitoring.photoMonitoring = photoMonitoring;

      const id = this.serviceMonitoringForm.get('id')?.value;
      console.log(serviceMonitoring);
      console.log(id);
      if (id == '0') {
        this.registerServiceMonitoring(serviceMonitoring);
      } else {
        serviceMonitoring.id = id;
        this.updateServiceMonitoring(serviceMonitoring);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.serviceMonitoringForm.reset();
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
    modelTitle.innerHTML = 'Actualizar Monitoreo servicio';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.serviceMonitoring.filter((data: { id: any; }) => data.id === id);
    const dateHour = listData[0].dateHour.substring(0, 10);
    const fortmatdateHour = this.pipe.transform(dateHour, 'yyyy-MM-dd');
    this.serviceMonitoringForm.controls['id'].setValue(listData[0].id);
    this.serviceMonitoringForm.controls['idTrackingService'].setValue(listData[0].idTrackingService);
    this.serviceMonitoringForm.controls['dateHour'].setValue(fortmatdateHour);
    this.serviceMonitoringForm.controls['status'].setValue(listData[0].status);
    this.serviceMonitoringForm.controls['observation'].setValue(listData[0].observation);
    this.serviceMonitoringForm.controls['photoMonitoring'].setValue(listData[0].photoMonitoring);
  }

  listServiceMonitoring() {
    this.service.listServiceMonitoring()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.serviceMonitoring;
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

  registerServiceMonitoring(serviceMonitoring) {
    this.service.registerServiceMonitoring(serviceMonitoring)
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
              this.listServiceMonitoring();
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

  updateServiceMonitoring(serviceMonitoring) {
    this.service.updateServiceMonitoring(serviceMonitoring)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listServiceMonitoring();
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

  deleteServiceMonitoring(id) {
    this.service.deleteServiceMonitoring(id)
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
              this.listServiceMonitoring();
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
