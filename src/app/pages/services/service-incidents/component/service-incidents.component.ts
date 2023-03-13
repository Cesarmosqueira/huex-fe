import { Component, Input, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {ServiceIncidents} from "../models/service-incidents.model";
import {ServiceIncidentsService} from "../services/service-incidents.service";
import { Tracking } from '../../tracking/models/tracking.model';
import {TrackingService} from "../../tracking/services/tracking.service";
import {Customer} from "../../../customers/customer/models/customer.model";
import {TruckFleet} from "../../../vehicles/truck-fleet/models/truck-fleet.model";


@Component({
  selector: 'app-service-incidents',
  templateUrl: './service-incidents.component.html',
  styleUrls: ['./service-incidents.component.scss']
})
export class ServiceIncidentsComponent implements OnInit {


  idServiceIncidentOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  serviceIncidentForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  serviceIncident?: any;
  test: ServiceIncidents[] = [];
  serviceIncidentList!: Observable<ServiceIncidents[]>;
  total: Observable<number>;
  pipe: any;

  typeDamage:string[]=['A-FALLO FABRICA','B-PRODUCTO INCOMPLETO','C-DETERIORO DEL PRODUCTO POR TIEMPO',
  'D-DAÑO ORIGEN','E-DAÑO EN EL TRANSPORTE','F-MAL ALMACENAJE','G-MAL USO','H-DAÑO POR MALA MANIPULACION',
  'I-FALLA DE CONTROL DE CALIDAD EN ORIGEN DE DESPACHO','J-EMPAQUE DAÑADO',
  'K-SINIESTRADO','K-MALA ENTREGA','M-FALTANTE','Q-OTROS'];

  status:string[]=['SEDE HUEX','EN TIENDA','EN ALMACEN CLIENTE']

  chargeIncident:string[]=['BUEN ESTADO','MAL ESTADO'];

  tracking:Tracking[]=[];
  selectTracking=null;


  constructor(public service: ServiceIncidentsService,
              private serviceTracking:TrackingService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.serviceIncidentList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Incidentes servicios', active: true }];

    /**
     * Form Validation
     */
    this.serviceIncidentForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      trackingService: [''],
      folio: [''],
      sku: [''],
      nameProduct: [''],
      observationDate: [''],
      damageType: [''],
      motive: [''],
      responsible: [''],
      fullName: [''],
      stored: [''],
      quantityUnits: [''],
      observation: [''],
      grt:[''],
      grr: [''],
      order: [''],
      status: [''],
      price: [''],
      chargeIncident: [''],


      btnSave: []
    });

    this.serviceIncidentList.subscribe(x => {
      this.content = this.serviceIncident;
      this.serviceIncident = Object.assign([], x);
    });
    this.idServiceIncidentOuput = 0;

    this.listServiceIndicent();
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
          this.deleteIncidentService(id);
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
    return this.serviceIncidentForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.serviceIncidentForm.valid) {
      this.pipe = new DatePipe('en-US');
      const trackingServiceId=this.selectTracking.id;
      const folio = this.serviceIncidentForm.get('folio')?.value;
      const sku = this.serviceIncidentForm.get('sku')?.value;
      const nameProduct = this.serviceIncidentForm.get('nameProduct')?.value;
      const observationDate = this.serviceIncidentForm.get('observationDate')?.value;
      const fortmatObservationDate = this.pipe.transform(observationDate, 'yyyy-MM-dd');
      const damageType = this.serviceIncidentForm.get('damageType')?.value;
      const motive = this.serviceIncidentForm.get('motive')?.value;
      const responsible = this.serviceIncidentForm.get('responsible')?.value;
      const fullName = this.serviceIncidentForm.get('fullName')?.value;
      const stored = this.serviceIncidentForm.get('stored')?.value;
      const quantityUnits = this.serviceIncidentForm.get('quantityUnits')?.value;
      const observation = this.serviceIncidentForm.get('observation')?.value;
      const grt = this.serviceIncidentForm.get('grt')?.value;
      const grr = this.serviceIncidentForm.get('grr')?.value;
      const order = this.serviceIncidentForm.get('order')?.value;
      const status = this.serviceIncidentForm.get('status')?.value;
      const price = this.serviceIncidentForm.get('price')?.value;
      const chargeIncident = this.serviceIncidentForm.get('chargeIncident')?.value;


      let serviceIncident = new ServiceIncidents();
      let tracking=new Tracking();
      tracking.id=trackingServiceId;
      serviceIncident.trackingService = tracking;
      serviceIncident.folio = folio;
      serviceIncident.sku=sku;
      serviceIncident.nameProduct=nameProduct;
      serviceIncident.observationDate=fortmatObservationDate;
      serviceIncident.damageType=damageType;
      serviceIncident.motive=motive;
      serviceIncident.responsible=responsible;
      serviceIncident.fullName=fullName;
      serviceIncident.stored=stored;
      serviceIncident.quantityUnits=quantityUnits;
      serviceIncident.observation=observation;
      serviceIncident.grt=grt;
      serviceIncident.grr=grr;
      serviceIncident.order=order;
      serviceIncident.status=status;
      serviceIncident.price=price;
      serviceIncident.chargeIncident=chargeIncident;




      const id = this.serviceIncidentForm.get('id')?.value;

      if (id == '0') {
        this.registerIncidentService(serviceIncident);
      } else {
        serviceIncident.id = id;
        this.updateIncidentService(serviceIncident);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.serviceIncidentForm.reset();
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
    var listData = this.serviceIncident.filter((data: { id: any; }) => data.id === id);


    this.serviceIncidentForm.controls['id'].setValue(listData[0].id);
    this.serviceIncidentForm.controls['folio'].setValue(listData[0].folio);
    this.serviceIncidentForm.controls['sku'].setValue(listData[0].sku);
    this.serviceIncidentForm.controls['nameProduct'].setValue(listData[0].nameProduct);

    if (listData[0].observationDate != null || listData[0].observationDate != undefined) {
      const observationDate = listData[0].observationDate.substring(0, 10);
      const fortmatObservationDate = this.pipe.transform(observationDate, 'yyyy-MM-dd');
      this.serviceIncidentForm.controls['observationDate'].setValue(fortmatObservationDate);
    }

    this.serviceIncidentForm.controls['damageType'].setValue(listData[0].damageType);
    this.serviceIncidentForm.controls['motive'].setValue(listData[0].motive);
    this.serviceIncidentForm.controls['responsible'].setValue(listData[0].responsible);
    this.serviceIncidentForm.controls['fullName'].setValue(listData[0].fullName);
    this.serviceIncidentForm.controls['stored'].setValue(listData[0].stored);
    this.serviceIncidentForm.controls['quantityUnits'].setValue(listData[0].quantityUnits);
    this.serviceIncidentForm.controls['observation'].setValue(listData[0].observation);
    this.serviceIncidentForm.controls['grt'].setValue(listData[0].grt);
    this.serviceIncidentForm.controls['grr'].setValue(listData[0].grr);
    this.serviceIncidentForm.controls['order'].setValue(listData[0].order);
    this.serviceIncidentForm.controls['status'].setValue(listData[0].status);
    this.serviceIncidentForm.controls['price'].setValue(listData[0].price);
    this.serviceIncidentForm.controls['chargeIncident'].setValue(listData[0].chargeIncident);


    let tracking = this.tracking.filter((data: { id: any; }) => data.id === listData[0].trackingService.id);
    this.selectTracking=tracking[0];

    this.idServiceIncidentOuput = id;
  }

  listServiceIndicent() {
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

  registerIncidentService(servicesIncident) {
    this.service.registerServiceIncidents(servicesIncident)
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
              this.listServiceIndicent();
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

  updateIncidentService(serviceIncident) {
    this.service.updateServiceIncidents(serviceIncident)
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
              this.listServiceIndicent();
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
    this.serviceIncidentForm.controls['id'].setValue("0");
    this.serviceIncidentForm.controls['trackingService'].setValue(null);
    this.serviceIncidentForm.controls['folio'].setValue("");
    this.serviceIncidentForm.controls['sku'].setValue("");
    this.serviceIncidentForm.controls['nameProduct'].setValue("");
    this.serviceIncidentForm.controls['observationDate'].setValue("");
    this.serviceIncidentForm.controls['damageType'].setValue("");
    this.serviceIncidentForm.controls['motive'].setValue("");
    this.serviceIncidentForm.controls['responsible'].setValue("");
    this.serviceIncidentForm.controls['fullName'].setValue("");
    this.serviceIncidentForm.controls['stored'].setValue("");
    this.serviceIncidentForm.controls['quantityUnits'].setValue("");
    this.serviceIncidentForm.controls['observation'].setValue("");
    this.serviceIncidentForm.controls['grt'].setValue("");
    this.serviceIncidentForm.controls['grr'].setValue("");
    this.serviceIncidentForm.controls['order'].setValue("");
    this.serviceIncidentForm.controls['status'].setValue("");
    this.serviceIncidentForm.controls['price'].setValue("");
    this.serviceIncidentForm.controls['chargeIncident'].setValue("");

  }

  enableInputs() {
    this.serviceIncidentForm.controls['id'].enable();
    this.serviceIncidentForm.controls['trackingService'].enable();
    this.serviceIncidentForm.controls['folio'].enable();
    this.serviceIncidentForm.controls['sku'].enable();
    this.serviceIncidentForm.controls['nameProduct'].enable();
    this.serviceIncidentForm.controls['observationDate'].enable();
    this.serviceIncidentForm.controls['damageType'].enable();
    this.serviceIncidentForm.controls['motive'].enable();
    this.serviceIncidentForm.controls['responsible'].enable();
    this.serviceIncidentForm.controls['fullName'].enable();
    this.serviceIncidentForm.controls['stored'].enable();
    this.serviceIncidentForm.controls['quantityUnits'].enable();
    this.serviceIncidentForm.controls['observation'].enable();
    this.serviceIncidentForm.controls['grt'].enable();
    this.serviceIncidentForm.controls['grr'].enable();
    this.serviceIncidentForm.controls['order'].enable();
    this.serviceIncidentForm.controls['status'].enable();
    this.serviceIncidentForm.controls['price'].enable();
    this.serviceIncidentForm.controls['chargeIncident'].enable();

  }


  deleteIncidentService(id) {
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
              this.listServiceIndicent();
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
