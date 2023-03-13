import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Rate} from "../models/rate.model";
import {RateService} from "../services/rate.service";
import {Route} from "../../route/models/route.model";
import {RouteService} from "../../route/services/route.service";
import {Customer} from "../../customer/models/customer.model";
import {CustomerService} from "../../customer/services/customer.service";

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

  idRateOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  rateForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  rates?: any;
  test: Rate[] = [];
  ratesList!: Observable<Rate[]>;
  total: Observable<number>;
  pipe: any;

  customers:Customer[]=[];
  selectCustomer=null;

  routes:Route[]=[];
  selectRoute=null;

  constructor(public service: RateService,
              private modalService: NgbModal,
              private serviceRoute:RouteService,
              private serviceCustomer:CustomerService,
              private formBuilder: UntypedFormBuilder) {
    this.ratesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cliente' }, { label: 'Tarifas clientes', active: true }];

    /**
     * Form Validation
     */
    this.rateForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      customer: ['', [Validators.required]],
      route: ['', [Validators.required]],
      leadTime: [''],
      routeDetail: [''],
      tonNumber: [''],
      volume: [''],
      cost: ['', [Validators.required]],
      observationRate: [''],
      btnSave: []
    });

    this.ratesList.subscribe(x => {
      this.content = this.rates;
      this.rates = Object.assign([], x);
    });
    this.idRateOuput = 0;

    this.listRates();
    this.listCustomers();
    this.listRoutes()
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
          this.deleteRate(id);
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
    this.selectRoute=null;
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.rateForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.rateForm.valid) {
      this.pipe = new DatePipe('en-US');
      const customerId =this.selectCustomer.id;
      const routeId = this.selectRoute.id;
      const routeDetail = this.rateForm.get('routeDetail')?.value;
      const tonNumber = this.rateForm.get('tonNumber')?.value;
      const leadTime = this.rateForm.get('leadTime')?.value;
      const volume = this.rateForm.get('volume')?.value;
      const cost = this.rateForm.get('cost')?.value;
      const observationRate = this.rateForm.get('observationRate')?.value;

      let rate = new Rate();
      let customers=new Customer();
      let routes=new Route();
      customers.id=customerId;
      routes.id=routeId;

      rate.customer = customers;
      rate.route = routes;
      rate.routeDetail = routeDetail;
      rate.leadTime = leadTime;
      rate.tonNumber = tonNumber;
      rate.volume = volume;
      rate.cost = cost;
      rate.observationRate = observationRate;

      const id = this.rateForm.get('id')?.value;

      if (id == '0') {
        this.registerRates(rate);
      } else {
        rate.id = id;
        this.updateRates(rate);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.rateForm.reset();
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
    modelTitle.innerHTML = 'Actualizar rutas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.rates.filter((data: { id: any; }) => data.id === id);
    this.rateForm.controls['id'].setValue(listData[0].id);
    this.rateForm.controls['routeDetail'].setValue(listData[0].routeDetail);
    this.rateForm.controls['leadTime'].setValue(listData[0].leadTime);
    this.rateForm.controls['tonNumber'].setValue(listData[0].tonNumber);
    this.rateForm.controls['volume'].setValue(listData[0].volume);
    this.rateForm.controls['cost'].setValue(listData[0].cost);
    this.rateForm.controls['observationRate'].setValue(listData[0].observationRate);
    this.selectRoute=listData[0].route;
    this.selectCustomer=listData[0].customer;

    this.idRateOuput = id;
  }

  listRates() {
    this.service.listRates()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.rates;
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

  registerRates(rates) {
    this.service.registerRate(rates)
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
              const rateDto = response.datos.rate;
              this.idRateOuput = rateDto.id;
              this.listRates();
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

  updateRates(rates) {
    this.service.updateRate(rates)
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
              this.listRates();
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
    this.rateForm.controls['id'].setValue("0");
    this.rateForm.controls['customer'].setValue(null);
    this.rateForm.controls['route'].setValue(null);
    this.rateForm.controls['routeDetail'].setValue("");
    this.rateForm.controls['leadTime'].setValue("");
    this.rateForm.controls['tonNumber'].setValue("");
    this.rateForm.controls['volume'].setValue("");
    this.rateForm.controls['cost'].setValue("");
    this.rateForm.controls['observationRate'].setValue("");

  }
  enableInputs() {
    this.rateForm.controls['id'].enable();
    this.rateForm.controls['customer'].enable();
    this.rateForm.controls['route'].enable();
    this.rateForm.controls['routeDetail'].enable();
    this.rateForm.controls['leadTime'].enable();
    this.rateForm.controls['tonNumber'].enable();
    this.rateForm.controls['volume'].enable();
    this.rateForm.controls['cost'].enable();
    this.rateForm.controls['observationRate'].enable();
  }

  deleteRate(id) {
    this.service.deleteRate(id)
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
              this.listRates();
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

  listRoutes() {
    this.serviceRoute.listRoutes()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.routes = response.datos.routes;
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
