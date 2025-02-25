import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {Customer} from "../models/customer.model";
import {CustomerService} from "../services/customer.service";


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  idCustomerOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  customerForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  customers?: any;
  test: Customer[] = [];
  customersList!: Observable<Customer[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: CustomerService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.customersList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cliente' }, { label: 'clientes', active: true }];

    /**
     * Form Validation
     */
    this.customerForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      ruc: ['', [Validators.required]],
      socialReason: ['', [Validators.required]],
      bankAccount: [''],
      registerDate: ['', [Validators.required]],
      btnSave: []
    });

    this.customersList.subscribe(x => {
      this.content = this.customers;
      this.customers = Object.assign([], x);
    });
    this.idCustomerOuput = 0;

    this.listCustomers();
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
          this.deleteCustomer(id);
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
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.customerForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.customerForm.valid) {
      this.pipe = new DatePipe('en-US');
      const ruc = this.customerForm.get('ruc')?.value;
      const socialReason = this.customerForm.get('socialReason')?.value;
      const bankAccount = this.customerForm.get('bankAccount')?.value;
      const registerDate = this.customerForm.get('registerDate')?.value;
      const fortmatregisterDate = this.pipe.transform(registerDate, 'yyyy-MM-ddTHH:mm:ss.sssZ');

      let customer = new Customer();
      customer.ruc = ruc;
      customer.socialReason = socialReason;
      customer.bankAccount = bankAccount;
      customer.registerDate = fortmatregisterDate;
      const id = this.customerForm.get('id')?.value;
      if (id == '0') {
        this.registerCustomer(customer);
      } else {
        customer.id = id;
        this.updateCustomer(customer);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.customerForm.reset();
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

    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar clientes';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.customers.filter((data: { id: any; }) => data.id === id);
    const registerDate = listData[0].registerDate.substring(0, 10);
    const fortmatregisterDate = this.pipe.transform(registerDate, 'yyyy-MM-dd');
    this.customerForm.controls['id'].setValue(listData[0].id);
    this.customerForm.controls['ruc'].setValue(listData[0].ruc);
    this.customerForm.controls['socialReason'].setValue(listData[0].socialReason);
    this.customerForm.controls['bankAccount'].setValue(listData[0].bankAccount);
    this.customerForm.controls['registerDate'].setValue(fortmatregisterDate);

    this.idCustomerOuput = id;
  }

  listCustomers() {
    this.service.listCustomers()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.customer;
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

  registerCustomer(customers) {
    this.service.registerCustomer(customers)
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
              const customerDto = response.datos.customerDto;
              this.idCustomerOuput = customerDto.id;
              this.listCustomers();
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

  updateCustomer(customers) {
    this.service.updateCustomer(customers)
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
              this.listCustomers();
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
    this.customerForm.controls['id'].setValue("0");
    this.customerForm.controls['ruc'].setValue(null);
    this.customerForm.controls['socialReason'].setValue("");
    this.customerForm.controls['bankAccount'].setValue("");
    this.customerForm.controls['registerDate'].setValue("");
  }

  enableInputs() {
    this.customerForm.controls['id'].enable();
    this.customerForm.controls['ruc'].enable();
    this.customerForm.controls['socialReason'].enable();
    this.customerForm.controls['bankAccount'].enable();
    this.customerForm.controls['registerDate'].enable();
  }

  deleteCustomer(id) {
    this.service.deleteCustomer(id)
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
              this.listCustomers();
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
