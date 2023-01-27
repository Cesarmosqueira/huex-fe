import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {EmployeeAttendance} from "../../employee-attendance/models/employee-attendance.model";
import {Observable} from "rxjs";
import {EmployeeAttendanceService} from "../../employee-attendance/services/employee-attendance.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {EmployeeDiscount} from "../models/employee-discount.model";
import {EmployeeDiscountService} from "../services/employee-discount.service";
import {Employee} from "../../employee/models/employee.model";
import {EmployeeService} from "../../employee/services/employee.service";

@Component({
  selector: 'app-employee-discount',
  templateUrl: './employee-discount.component.html',
  styleUrls: ['./employee-discount.component.scss']
})
export class EmployeeDiscountComponent implements OnInit {

  idEmployeeDiscountOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  employeeDiscountForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  employeeDiscount?: any;
  test: EmployeeDiscount[] = [];
  employeeDiscountList!: Observable<EmployeeDiscount[]>;
  total: Observable<number>;
  pipe: any;


  employees:Employee[]=[];
  selectEmployee:any;


  constructor(public service: EmployeeDiscountService,
              private modalService: NgbModal,
              private serviceEmployee:EmployeeService,
              private formBuilder: UntypedFormBuilder) {
    this.employeeDiscountList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Descuentos', active: true }];

    /**
     * Form Validation
     */
    this.employeeDiscountForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      employee: ['', [Validators.required]],
      date: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      charge: ['', [Validators.required]],
    });

    this.employeeDiscountList.subscribe(x => {
      this.content = this.employeeDiscount;
      this.employeeDiscount = Object.assign([], x);
    });
    this.listEmployees();
    this.listEmployeeDiscount();
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
          this.deleteEmployeeDiscount(id);
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
    this.selectEmployee=null;
    this.modalService.open(content, ngbModalOptions);  }

  /**
   * Form data get
   */
  get form() {
    return this.employeeDiscountForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.employeeDiscountForm.valid) {
      this.pipe = new DatePipe('en-US');
      const employeeId = this.selectEmployee.id;
      const date = this.employeeDiscountForm.get('date')?.value;
      const fortmatdate = this.pipe.transform(date, 'yyyy-MM-dd');
      const observations = this.employeeDiscountForm.get('observations')?.value;
      const charge = this.employeeDiscountForm.get('charge')?.value;


      let employeeDiscount = new EmployeeDiscount();
      let employee=new Employee();
      employee.id=employeeId;
      employeeDiscount.employee = employee;
      employeeDiscount.date = fortmatdate;
      employeeDiscount.observations = observations;
      employeeDiscount.charge = charge;

      const id = this.employeeDiscountForm.get('id')?.value;
      console.log(employeeDiscount);
      console.log(id);
      if (id == '0') {
        this.registerEmployeeDiscount(employeeDiscount);
      } else {
        employeeDiscount.id = id;
        this.updateEmployeeDiscount(employeeDiscount);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.employeeDiscountForm.reset();
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
    var listData = this.employeeDiscount.filter((data: { id: any; }) => data.id === id);
    const date = listData[0].date.substring(0, 10);
    const fortmatdate = this.pipe.transform(date, 'yyyy-MM-dd');
    this.employeeDiscountForm.controls['id'].setValue(listData[0].id);
    this.employeeDiscountForm.controls['employee'].setValue(listData[0].employee);
    this.employeeDiscountForm.controls['date'].setValue(fortmatdate);
    this.employeeDiscountForm.controls['observations'].setValue(listData[0].observations);
    this.employeeDiscountForm.controls['charge'].setValue(listData[0].charge);
    this.selectEmployee=listData[0].employee.fullName;
    this.idEmployeeDiscountOuput = id;
  }

  listEmployeeDiscount() {
    this.service.listEmployeeDiscount()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.discounts;
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

  registerEmployeeDiscount(employeeDiscount) {
    this.service.registerEmployeeDiscount(employeeDiscount)
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
              this.listEmployeeDiscount();
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

  updateEmployeeDiscount(employeeDiscount) {
    this.service.updateEmployeeDiscount(employeeDiscount)
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
              this.listEmployeeDiscount();
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
    this.employeeDiscountForm.controls['id'].setValue("0");
    this.employeeDiscountForm.controls['employee'].setValue("");
    this.employeeDiscountForm.controls['date'].setValue("");
    this.employeeDiscountForm.controls['observations'].setValue("");
    this.employeeDiscountForm.controls['charge'].setValue("");

  }

  enableInputs() {
    this.employeeDiscountForm.controls['id'].enable();
    this.employeeDiscountForm.controls['employee'].enable();
    this.employeeDiscountForm.controls['date'].enable();
    this.employeeDiscountForm.controls['observations'].enable();
    this.employeeDiscountForm.controls['charge'].enable();
  }

  deleteEmployeeDiscount(id) {
    this.service.deleteEmployeeDiscount(id)
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
              this.listEmployeeDiscount();
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

  listEmployees() {
    this.serviceEmployee.listEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.employees = response.datos.employees;
              console.log(this.employees);
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
