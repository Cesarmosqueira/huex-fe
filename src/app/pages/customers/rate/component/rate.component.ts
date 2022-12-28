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

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

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

  constructor(public service: RateService,
              private modalService: NgbModal,
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
      customerId: ['', [Validators.required]],
      routeId: ['', [Validators.required]],
      leadTime: ['', [Validators.required]],
      volume: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      observationRate: ['', [Validators.required]]
    });

    this.ratesList.subscribe(x => {
      this.content = this.rates;
      this.rates = Object.assign([], x);
    });

    this.listRates();
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
          this.deleteRates(id);
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
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
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
      const customerId = 7;//this.rateForm.get('customerId')?.value;
      const routeId = 1;//this.rateForm.get('routeId')?.value;
      const leadTime = this.rateForm.get('leadTime')?.value;
      const volume = this.rateForm.get('volume')?.value;
      const cost = this.rateForm.get('cost')?.value;
      const observationRate = this.rateForm.get('observationRate')?.value;

      let rate = new Rate();
      rate.customerId = customerId;
      rate.routeId = routeId;
      rate.leadTime = leadTime;
      rate.volume = volume;
      rate.cost = cost;
      rate.observationRate = observationRate;

      const id = this.rateForm.get('id')?.value;
      console.log(rate);
      console.log(id);
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
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar tarifas';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.rates.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.rateForm.controls['id'].setValue(listData[0].id);
    this.rateForm.controls['customerId'].setValue(listData[0].customerId);
    this.rateForm.controls['routeId'].setValue(listData[0].routeId);
    this.rateForm.controls['leadTime'].setValue(listData[0].leadTime);
    this.rateForm.controls['volume'].setValue(listData[0].volume);
    this.rateForm.controls['cost'].setValue(listData[0].cost);
    this.rateForm.controls['observationRate'].setValue(listData[0].observationRate);
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
          } else {
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error, comuniquese con el Encargado",
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

  deleteRates(id) {
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
