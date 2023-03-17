import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {ProviderDiscount} from "../models/provider-discount.model";
import {Providers} from "../../../providers/provider/models/providers.model";
import {ProviderService} from "../../../providers/provider/services/provider.service";
import {ProviderDiscountService} from "../services/provider-discount.service";

@Component({
  selector: 'app-provider-discount',
  templateUrl: './provider-discount.component.html',
  styleUrls: ['./provider-discount.component.scss']
})
export class ProviderDiscountComponent implements OnInit {


  idProviderDiscountOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  providerDiscountForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  providerDiscount?: any;
  test: ProviderDiscount[] = [];
  providerDiscountList!: Observable<ProviderDiscount[]>;
  total: Observable<number>;
  pipe: any;


  providers:Providers[]=[];
  selectProviders:any;


  constructor(public service: ProviderDiscountService,
              private modalService: NgbModal,
              private serviceProvider:ProviderService,
              private formBuilder: UntypedFormBuilder) {
    this.providerDiscountList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Descuentos proveedor', active: true }];

    /**
     * Form Validation
     */
    this.providerDiscountForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      provider: ['', [Validators.required]],
      date: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      status: [''],
      charge: ['', [Validators.required]],
    });

    this.providerDiscountList.subscribe(x => {
      this.content = this.providerDiscount;
      this.providerDiscount = Object.assign([], x);
    });
    this.listProvider();
    this.listProviderDiscount();
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
          this.deleteProviderDiscount(id);
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
    this.enableInputs();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
    this.selectProviders=null;
    this.modalService.open(content, ngbModalOptions);  }

  /**
   * Form data get
   */
  get form() {
    return this.providerDiscountForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.providerDiscountForm.valid) {
      this.pipe = new DatePipe('en-US');
      const providerId = this.selectProviders.id;
      const date = this.providerDiscountForm.get('date')?.value;
      const fortmatdate = this.pipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.sssZ');
      const observations = this.providerDiscountForm.get('observations')?.value;
      const status = this.providerDiscountForm.get('status')?.value;
      const charge = this.providerDiscountForm.get('charge')?.value;


      let providerDiscount = new ProviderDiscount();
      let provider=new Providers();
      provider.id=providerId;
      providerDiscount.provider = provider;
      providerDiscount.date = fortmatdate;
      providerDiscount.observations = observations;
      providerDiscount.status = status;
      providerDiscount.charge = charge;

      const id = this.providerDiscountForm.get('id')?.value;
      if (id == '0') {
        this.registerProviderDiscount(providerDiscount);
      } else {
        providerDiscount.id = id;
        this.updateProviderDiscount(providerDiscount);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.providerDiscountForm.reset();
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
    modelTitle.innerHTML = 'Actualizar Descuento trabajador';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.providerDiscount.filter((data: { id: any; }) => data.id === id);
    const date = listData[0].date.substring(0, 10);
    const fortmatdate = this.pipe.transform(date, 'yyyy-MM-dd');
    this.providerDiscountForm.controls['id'].setValue(listData[0].id);
    this.providerDiscountForm.controls['date'].setValue(fortmatdate);
    this.providerDiscountForm.controls['observations'].setValue(listData[0].observations);
    this.providerDiscountForm.controls['status'].setValue(listData[0].status);
    this.providerDiscountForm.controls['charge'].setValue(listData[0].charge);
    this.selectProviders=listData[0].provider;
    this.idProviderDiscountOuput = id;
  }

  listProviderDiscount() {
    this.service.listProviderDiscount()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.providerDiscount;
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

  registerProviderDiscount(providerDiscount) {
    this.service.registerProviderDiscount(providerDiscount)
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
              this.listProviderDiscount();
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

  updateProviderDiscount(providerDiscount) {
    this.service.updateProviderDiscount(providerDiscount)
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
              this.listProviderDiscount();
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
    this.providerDiscountForm.controls['id'].setValue("0");
    this.providerDiscountForm.controls['provider'].setValue("");
    this.providerDiscountForm.controls['date'].setValue("");
    this.providerDiscountForm.controls['observations'].setValue("");
    this.providerDiscountForm.controls['status'].setValue("");
    this.providerDiscountForm.controls['charge'].setValue("");

  }

  enableInputs() {
    this.providerDiscountForm.controls['id'].enable();
    this.providerDiscountForm.controls['provider'].enable();
    this.providerDiscountForm.controls['date'].enable();
    this.providerDiscountForm.controls['observations'].enable();
    this.providerDiscountForm.controls['status'].enable();
    this.providerDiscountForm.controls['charge'].enable();
  }

  deleteProviderDiscount(id) {
    this.service.deleteProviderDiscount(id)
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
              this.listProviderDiscount();
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

  listProvider() {
    this.serviceProvider.listProviders()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.providers = response.datos.providers;
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
