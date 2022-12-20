import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Rate} from "../../rate/models/rate.model";
import {Observable} from "rxjs";
import {RateService} from "../../rate/services/rate.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {CustomerEmployees} from "../models/customer-employees.model";
import {CustomerEmployeesService} from "../services/customer-employees.service";

@Component({
  selector: 'app-customer-employees',
  templateUrl: './customer-employees.component.html',
  styleUrls: ['./customer-employees.component.scss']
})
export class CustomerEmployeesComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  customerEmployeesForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  customerEmployees?: any;
  test: CustomerEmployees[] = [];
  customerEmployeesList!: Observable<CustomerEmployees[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: CustomerEmployeesService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.customerEmployeesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cliente' }, { label: 'Choferes Aptos', active: true }];

    /**
     * Form Validation
     */
    this.customerEmployeesForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      status: ['', [Validators.required]],
      registerDate: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      employee: ['', [Validators.required]],
    });

    this.customerEmployeesList.subscribe(x => {
      this.content = this.customerEmployees;
      this.customerEmployees = Object.assign([], x);
    });

    this.listCustomerEmployees();
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
          this.deleteCustomerEmployees(id);
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
    return this.customerEmployeesForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.customerEmployeesForm.valid) {
      this.pipe = new DatePipe('en-US');
      const status = this.customerEmployeesForm.get('status')?.value;
      const registerDate = this.customerEmployeesForm.get('registerDate')?.value;
      const fortmatregisterDate = this.pipe.transform(registerDate, 'yyyy-MM-dd');
      const observations = this.customerEmployeesForm.get('observations')?.value;
      const customer = 1;//this.customerEmployeesForm.get('customer')?.value;
      const employee = 3;//this.customerEmployeesForm.get('employee')?.value;

      let customerEmployees = new CustomerEmployees();
      customerEmployees.status = status;
      customerEmployees.registerDate = fortmatregisterDate;
      customerEmployees.observations = observations;
      customerEmployees.customer = customer;
      customerEmployees.employee = employee;

      const id = this.customerEmployees.get('id')?.value;
      console.log(customerEmployees);
      console.log(id);
      if (id == '0') {
        this.registerCustomerEmployees(customerEmployees);
      } else {
        customerEmployees.id = id;
        this.updateCustomerEmployees(customerEmployees);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.customerEmployeesForm.reset();
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
    modelTitle.innerHTML = 'Actualizar Choferes aptos';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.customerEmployees.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.customerEmployeesForm.controls['id'].setValue(listData[0].id);
    this.customerEmployeesForm.controls['status'].setValue(listData[0].status);
    this.customerEmployeesForm.controls['registerDate'].setValue(fortmatFabricationDate);
    this.customerEmployeesForm.controls['observations'].setValue(listData[0].observations);
    this.customerEmployeesForm.controls['customer'].setValue(listData[0].customer);
    this.customerEmployeesForm.controls['employee'].setValue(listData[0].employee);
  }

  listCustomerEmployees() {
    this.service.listCustomerEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.customerEmployeesDtoList;
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

  registerCustomerEmployees(customerEmployees) {
    this.service.registerCustomerEmployee(customerEmployees)
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
              this.listCustomerEmployees();
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

  updateCustomerEmployees(customerEmployees) {
    this.service.updateCustomerEmployee(customerEmployees)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listCustomerEmployees();
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

  deleteCustomerEmployees(id) {
    this.service.deleteCustomerEmployee(id)
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
              this.listCustomerEmployees();
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
