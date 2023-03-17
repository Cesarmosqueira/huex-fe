import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {CustomerEmployees} from "../models/customer-employees.model";
import {CustomerEmployeesService} from "../services/customer-employees.service";
import {Customer} from "../../customer/models/customer.model";
import {Employee} from "../../../employees/employee/models/employee.model";
import {CustomerService} from "../../customer/services/customer.service";
import {EmployeeService} from "../../../employees/employee/services/employee.service";

@Component({
  selector: 'app-customer-employees',
  templateUrl: './customer-employees.component.html',
  styleUrls: ['./customer-employees.component.scss']
})
export class CustomerEmployeesComponent implements OnInit {

  idCustomerEmployeeOuput: number = 0;

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

  customers:Customer[]=[];
  selectCustomer=null;

  employees:Employee[]=[];
  selectEmployee=null;



  constructor(public service: CustomerEmployeesService,
              private modalService: NgbModal,
              private serviceCustomer:CustomerService,
              private serviceEmployee:EmployeeService,
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
      observations: [''],
      customer: ['', [Validators.required]],
      employee: ['', [Validators.required]],
    });

    this.customerEmployeesList.subscribe(x => {
      this.content = this.customerEmployees;
      this.customerEmployees = Object.assign([], x);
    });
    this.idCustomerEmployeeOuput = 0;

    this.listCustomers();
    this.listEmployees();
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
    this.clear();
    this.submitted = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
    this.selectEmployee=null;
    this.selectCustomer=null;
    this.modalService.open(content, ngbModalOptions);
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
      const idCustomer = this.selectCustomer.id;
      const idEmployee = this.selectEmployee.id;
      const status = this.customerEmployeesForm.get('status')?.value;
      const registerDate = this.customerEmployeesForm.get('registerDate')?.value;
      const fortmatregisterDate = this.pipe.transform(registerDate, 'yyyy-MM-ddTHH:mm:ss.sssZ');
      const observations = this.customerEmployeesForm.get('observations')?.value;

      let customerEmployees = new CustomerEmployees();
      let customers=new Customer();
      let employees=new Employee();
      employees.id=idEmployee;
      customers.id=idCustomer;
      customerEmployees.customer = customers;
      customerEmployees.employee = employees;
      customerEmployees.status = status;
      customerEmployees.registerDate = fortmatregisterDate;
      customerEmployees.observations = observations;

      const id = this.customerEmployeesForm.get('id')?.value;

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
    this.enableInputs();

    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar Choferes aptos';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.customerEmployees.filter((data: { id: any; }) => data.id === id);
    const registerDate = listData[0].registerDate.substring(0, 10);
    const fortmatregisterDate = this.pipe.transform(registerDate, 'yyyy-MM-dd');
    this.customerEmployeesForm.controls['id'].setValue(listData[0].id);
    this.customerEmployeesForm.controls['status'].setValue(listData[0].status);
    this.customerEmployeesForm.controls['registerDate'].setValue(fortmatregisterDate);
    this.customerEmployeesForm.controls['observations'].setValue(listData[0].observations);
    this.selectCustomer = listData[0].customer;
    this.selectEmployee=listData[0].employee;
    this.idCustomerEmployeeOuput = id;

  }

  listCustomerEmployees() {
    this.service.listCustomerEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.customerEmployee;
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
              const customerEmployeeDto = response.datos.customerEmployeeDto;
              this.idCustomerEmployeeOuput = customerEmployeeDto.id;
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

  updateCustomerEmployees(customerEmployees) {
    this.service.updateCustomerEmployee(customerEmployees)
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

  clear() {
    this.customerEmployeesForm.controls['id'].setValue("0");
    this.customerEmployeesForm.controls['customer'].setValue(null);
    this.customerEmployeesForm.controls['employee'].setValue(null);
    this.customerEmployeesForm.controls['status'].setValue("");
    this.customerEmployeesForm.controls['registerDate'].setValue("");
    this.customerEmployeesForm.controls['observations'].setValue("");
  }

  enableInputs() {
    this.customerEmployeesForm.controls['id'].enable();
    this.customerEmployeesForm.controls['customer'].enable();
    this.customerEmployeesForm.controls['employee'].enable();
    this.customerEmployeesForm.controls['status'].enable();
    this.customerEmployeesForm.controls['registerDate'].enable();
    this.customerEmployeesForm.controls['observations'].enable();
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

  listEmployees() {
    this.serviceEmployee.listEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.employees = response.datos.employees;
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
