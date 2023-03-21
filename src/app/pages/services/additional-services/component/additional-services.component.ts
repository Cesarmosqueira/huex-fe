import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Rate} from "../../../customers/rate/models/rate.model";
import {Observable} from "rxjs";
import {Customer} from "../../../customers/customer/models/customer.model";
import {Route} from "../../../customers/route/models/route.model";
import {RateService} from "../../../customers/rate/services/rate.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {RouteService} from "../../../customers/route/services/route.service";
import {CustomerService} from "../../../customers/customer/services/customer.service";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {AdditionalServices} from "../models/additional-services.model";
import {TruckFleet} from "../../../vehicles/truck-fleet/models/truck-fleet.model";
import {AdditionalServicesService} from "../services/additional-services.service";
import {TruckFleetService} from "../../../vehicles/truck-fleet/services/truck-fleet.service";

@Component({
  selector: 'app-additional-services',
  templateUrl: './additional-services.component.html',
  styleUrls: ['./additional-services.component.scss']
})
export class AdditionalServicesComponent implements OnInit {


  idAdditionalServicesOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  additionalServicesForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  additionalServices?: any;
  test: AdditionalServices[] = [];
  additionalServicesList!: Observable<AdditionalServices[]>;
  total: Observable<number>;
  pipe: any;

  customers:Customer[]=[];
  selectCustomer=null;

  truckFleets:TruckFleet[]=[];
  selectTruckFleet=null;

  status:string[]=['FACTURADO','PENDIENTE','NO PROCEDE'];

  constructor(public service: AdditionalServicesService,
              private modalService: NgbModal,
              private serviceTruckFleet:TruckFleetService,
              private serviceCustomer:CustomerService,
              private formBuilder: UntypedFormBuilder) {
    this.additionalServicesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Servicios' }, { label: 'Servicios adicionales', active: true }];

    /**
     * Form Validation
     */
    this.additionalServicesForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      customer: ['', [Validators.required]],
      truckFleet: ['', [Validators.required]],
      dateService: ['',[Validators.required]],
      resources: [''],
      cost: [''],
      invoiceDetail: [''],
      status: [''],
      observation: [''],
      personRequest: [''],
      btnSave: []
    });

    this.additionalServicesList.subscribe(x => {
      this.content = this.additionalServices;
      this.additionalServices = Object.assign([], x);
    });
    this.idAdditionalServicesOuput = 0;

    this.listAdditionalServices();
    this.listCustomers();
    this.listTruckFleets()
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
          this.deleteAdditionalServices(id);
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
      size: 'lg'
    };
    this.selectCustomer=null;
    this.selectTruckFleet=null;
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.additionalServicesForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.additionalServicesForm.valid) {
      this.pipe = new DatePipe('en-US');
      const customerId =this.selectCustomer.id;
      const truckFleetId = this.selectTruckFleet.id;
      const dateService = this.additionalServicesForm.get('dateService')?.value;
      const fortmatDateService = this.pipe.transform(dateService, 'yyyy-MM-ddTHH:mm:ss.sssZ');
      const resources = this.additionalServicesForm.get('resources')?.value.toUpperCase();
      const cost = this.additionalServicesForm.get('cost')?.value;
      const invoiceDetail = this.additionalServicesForm.get('invoiceDetail')?.value.toUpperCase();
      const status = this.additionalServicesForm.get('status')?.value;
      const observation = this.additionalServicesForm.get('observation')?.value.toUpperCase();
      const personRequest = this.additionalServicesForm.get('personRequest')?.value.toUpperCase();


      let additionalServices = new AdditionalServices();
      let customers=new Customer();
      let truckFleet=new TruckFleet();
      customers.id=customerId;
      truckFleet.id=truckFleetId;

      additionalServices.customer = customers;
      additionalServices.truckFleet = truckFleet;
      additionalServices.dateService = fortmatDateService;
      additionalServices.resources = resources;
      additionalServices.cost = cost;
      additionalServices.invoiceDetail = invoiceDetail;
      additionalServices.status = status;
      additionalServices.observation = observation;
      additionalServices.personRequest = personRequest;

      const id = this.additionalServicesForm.get('id')?.value;

      if (id == '0') {
        this.registerAdditionalServices(additionalServices);
      } else {
        additionalServices.id = id;
        this.updateAdditionalServices(additionalServices);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.additionalServicesForm.reset();
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

    this.modalService.open(content, { size: 'lg', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar servicios adicionales';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.additionalServices.filter((data: { id: any; }) => data.id === id);
    this.additionalServicesForm.controls['id'].setValue(listData[0].id);
    const dateService = listData[0].dateService.substring(0, 10);
    const formatDateService = this.pipe.transform(dateService, 'yyyy-MM-dd');
    this.additionalServicesForm.controls['dateService'].setValue(formatDateService);
    this.additionalServicesForm.controls['resources'].setValue(listData[0].resources);
    this.additionalServicesForm.controls['cost'].setValue(listData[0].cost);
    this.additionalServicesForm.controls['invoiceDetail'].setValue(listData[0].invoiceDetail);
    this.additionalServicesForm.controls['status'].setValue(listData[0].status);
    this.additionalServicesForm.controls['observation'].setValue(listData[0].observation);
    this.additionalServicesForm.controls['personRequest'].setValue(listData[0].personRequest);

    this.selectTruckFleet=listData[0].truckFleet;
    this.selectCustomer=listData[0].customer;

    this.idAdditionalServicesOuput = id;
  }

  listAdditionalServices() {
    this.service.listAdditionalServices()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.additionalServicesDtos;
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

  registerAdditionalServices(additionalServices) {
    this.service.registerAdditionalServices(additionalServices)
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
              this.listAdditionalServices();
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

  updateAdditionalServices(additionalServices) {
    this.service.updateAdditionalServices(additionalServices)
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
              this.listAdditionalServices();
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
    this.additionalServicesForm.controls['id'].setValue("0");
    this.additionalServicesForm.controls['customer'].setValue(null);
    this.additionalServicesForm.controls['truckFleet'].setValue(null);
    this.additionalServicesForm.controls['dateService'].setValue("");
    this.additionalServicesForm.controls['resources'].setValue("");
    this.additionalServicesForm.controls['cost'].setValue("");
    this.additionalServicesForm.controls['invoiceDetail'].setValue("");
    this.additionalServicesForm.controls['status'].setValue("");
    this.additionalServicesForm.controls['observation'].setValue("");
    this.additionalServicesForm.controls['personRequest'].setValue("");
  }
  enableInputs() {
    this.additionalServicesForm.controls['id'].enable();
    this.additionalServicesForm.controls['customer'].enable();
    this.additionalServicesForm.controls['truckFleet'].enable();
    this.additionalServicesForm.controls['dateService'].enable();
    this.additionalServicesForm.controls['resources'].enable();
    this.additionalServicesForm.controls['cost'].enable();
    this.additionalServicesForm.controls['invoiceDetail'].enable();
    this.additionalServicesForm.controls['status'].enable();
    this.additionalServicesForm.controls['observation'].enable();
    this.additionalServicesForm.controls['personRequest'].enable();
  }

  deleteAdditionalServices(id) {
    this.service.deleteAdditionalServices(id)
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
              this.listAdditionalServices();
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

  listCustomers() {
    this.serviceCustomer.listCustomers()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.customers = response.datos.customer;
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

  listTruckFleets() {
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
}
