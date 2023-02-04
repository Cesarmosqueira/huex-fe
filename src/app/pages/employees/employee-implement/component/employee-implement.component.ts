import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Implement} from "../../implement/models/implement.model";
import {Observable} from "rxjs";
import {ImplementService} from "../../implement/services/implement.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {EmployeeImplement} from "../models/employee-implement.model";
import {EmployeeImplementService} from "../services/employee-implement.service";
import {Employee} from "../../employee/models/employee.model";
import {EmployeeService} from "../../employee/services/employee.service";

@Component({
  selector: 'app-employee-implement',
  templateUrl: './employee-implement.component.html',
  styleUrls: ['./employee-implement.component.scss']
})
export class EmployeeImplementComponent implements OnInit {

  idEmployeeImplemntOuput: number = 0;


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  employeeImplementForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  employeeImplement?: any;
  test: EmployeeImplement[] = [];
  employeeImplementsList!: Observable<EmployeeImplement[]>;
  total: Observable<number>;
  pipe: any;

  employees:Employee[]=[];
  selectEmployee:any;

  implementss:Implement[]=[];
  selectImplement=null;

  constructor(public service: EmployeeImplementService,
              private modalService: NgbModal,
              private serviceEmployee:EmployeeService,
              private serviceImplement:ImplementService,
              private formBuilder: UntypedFormBuilder) {
    this.employeeImplementsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Trabajadores Implementos', active: true }];

    /**
     * Form Validation
     */
    this.employeeImplementForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      employee: ['', [Validators.required]],
      implement: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      observations: [''],
    });

    this.employeeImplementsList.subscribe(x => {
      this.content = this.employeeImplement;
      this.employeeImplement = Object.assign([], x);
    });
    this.idEmployeeImplemntOuput = 0;
    console.log(this.idEmployeeImplemntOuput);

    this.listImplements();
    this.listEmployees();
    this.listEmployeeImplements();
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
          this.deleteEmployeeImplement(id);
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
    this.selectImplement=null;
    this.selectEmployee=null;
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.employeeImplementForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.employeeImplementForm.valid) {
      this.pipe = new DatePipe('en-US');
      const employeeId = this.selectEmployee.id;
      const implementId = this.selectImplement.id;
      const deliveryDate = this.employeeImplementForm.get('deliveryDate')?.value;
      const fortmatdeliveryDate = this.pipe.transform(deliveryDate, 'yyyy-MM-dd');
      const observations = this.employeeImplementForm.get('observations')?.value;

      let employeeImplement = new EmployeeImplement();
      let employees=new Employee();
      let implement=new  Implement();
      employees.id=employeeId;
      implement.id=implementId;
      employeeImplement.employee = employees;
      employeeImplement.implement = implement;
      employeeImplement.deliveryDate = fortmatdeliveryDate;
      employeeImplement.observations = observations;

      const id = this.employeeImplementForm.get('id')?.value;

      console.log(employeeImplement);
      console.log(id);
      if (id == '0') {
        this.registerEmployeeImplement(employeeImplement);
      } else {
        employeeImplement.id = id;
        this.updateEmployeeImplement(employeeImplement);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.employeeImplementForm.reset();
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
    modelTitle.innerHTML = 'Actualizar implementos trabajadores';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.employeeImplement.filter((data: { id: any; }) => data.id === id);
    const deliveryDate = listData[0].deliveryDate.substring(0, 10);
    const fortmatdeliveryDate = this.pipe.transform(deliveryDate, 'yyyy-MM-dd');
    this.employeeImplementForm.controls['id'].setValue(listData[0].id);
    this.employeeImplementForm.controls['deliveryDate'].setValue(fortmatdeliveryDate);
    this.employeeImplementForm.controls['observations'].setValue(listData[0].observations);
    this.selectEmployee=listData[0].employee;
    this.selectImplement=listData[0].implement;

    this.idEmployeeImplemntOuput = id;

  }

  listEmployeeImplements() {
    this.service.listEmployeeImplements()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.employeeImplement;
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

  registerEmployeeImplement(employeeImplement) {
    this.service.registerEmployeeImplement(employeeImplement)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            console.log(response);
            if (response.datos) {
              Swal.fire(
                '¡Registrado!',
                response.meta.mensajes[0].mensaje,
                'success'
              );

              this.listEmployeeImplements();
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

  updateEmployeeImplement(employeeImplement) {
    this.service.updateEmployeeImplement(employeeImplement)
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
              this.listEmployeeImplements();
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
    this.employeeImplementForm.controls['id'].setValue("0");
    this.employeeImplementForm.controls['employee'].setValue("");
    this.employeeImplementForm.controls['implement'].setValue("");
    this.employeeImplementForm.controls['deliveryDate'].setValue("");
    this.employeeImplementForm.controls['observations'].setValue("");
  }

  enableInputs() {
    this.employeeImplementForm.controls['id'].enable();
    this.employeeImplementForm.controls['employee'].enable();
    this.employeeImplementForm.controls['implement'].enable();
    this.employeeImplementForm.controls['deliveryDate'].enable();
    this.employeeImplementForm.controls['observations'].enable();
  }

  deleteEmployeeImplement(id) {
    this.service.deleteEmployeeImplement(id)
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
              this.listEmployeeImplements();
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

  listImplements() {
    this.serviceImplement.listImplements()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.implementss = response.datos.implementss;
              console.log(this.implementss);
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
