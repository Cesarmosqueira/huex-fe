import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {EmployeeAttendance} from "../models/employee-attendance.model";
import {EmployeeAttendanceService} from "../services/employee-attendance.service";
import {Employee} from "../../employee/models/employee.model";
import {EmployeeService} from "../../employee/services/employee.service";

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {

  idEmployeeAttendanceOuput: number = 0;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  employeeAttendanceForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  employeeAttendance?: any;
  test: EmployeeAttendance[] = [];
  employeeAttendanceList!: Observable<EmployeeAttendance[]>;
  total: Observable<number>;
  pipe: any;

  employees:Employee[]=[];
  selectEmployee:null;

  constructor(public service: EmployeeAttendanceService,
              private modalService: NgbModal,
              private serviceEmployee:EmployeeService,
              private formBuilder: UntypedFormBuilder) {
    this.employeeAttendanceList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Asistencia', active: true }];

    /**
     * Form Validation
     */
    this.employeeAttendanceForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      employeeId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });

    this.employeeAttendanceList.subscribe(x => {
      this.content = this.employeeAttendanceList;
      this.employeeAttendance = Object.assign([], x);
    });
    this.idEmployeeAttendanceOuput = 0;
    console.log(this.idEmployeeAttendanceOuput);

    this.listEmployees();
    this.listEmployeeAttendance();
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
          this.deleteEmployeeAttendance(id);
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
    return this.employeeAttendanceForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.employeeAttendanceForm.valid) {
      this.pipe = new DatePipe('en-US');
      const employeeId = this.employeeAttendanceForm.get('employeeId')?.value;
      const date = this.employeeAttendanceForm.get('date')?.value;
      const fortmatDate = this.pipe.transform(date, 'yyyy-MM-dd');
      const state = this.employeeAttendanceForm.get('state')?.value;

      let employeeAttendance = new EmployeeAttendance();
      employeeAttendance.employeeId = employeeId;
      employeeAttendance.date = fortmatDate;
      employeeAttendance.state = state;

      const id = this.employeeAttendanceForm.get('id')?.value;

      console.log(employeeAttendance);
      console.log(id);
      if (id == '0') {
        this.registerEmployeeAttendance(employeeAttendance);
      } else {
        employeeAttendance.id = id;
        this.updateEmployeeAttendance(employeeAttendance);
      }

      this.modalService.dismissAll();
      setTimeout(() => {
        this.employeeAttendanceForm.reset();
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
    modelTitle.innerHTML = 'Actualizar Asistencia trabajador';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.employeeAttendance.filter((data: { id: any; }) => data.id === id);
    const date = listData[0].date.substring(0, 10);
    const fortmatDate = this.pipe.transform(date, 'yyyy-MM-dd');
    this.employeeAttendanceForm.controls['id'].setValue(listData[0].id);
    this.employeeAttendanceForm.controls['employeeId'].setValue(listData[0].employeeId);
    this.employeeAttendanceForm.controls['date'].setValue(fortmatDate);
    this.employeeAttendanceForm.controls['state'].setValue(listData[0].state);
    this.idEmployeeAttendanceOuput = id;

  }

  listEmployeeAttendance() {
    this.service.listEmployeeAttendance()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.attendances;
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

  registerEmployeeAttendance(employeeAttendance) {
    this.service.registerEmployeeAttendance(employeeAttendance)
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
              const attendances = response.datos.attendances;
              this.idEmployeeAttendanceOuput = attendances.id;
              this.listEmployeeAttendance();
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

  updateEmployeeAttendance(employeeAttendance) {
    this.service.updateEmployeeAttendance(employeeAttendance)
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
              this.listEmployeeAttendance();
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
    this.employeeAttendanceForm.controls['id'].setValue("0");
    this.employeeAttendanceForm.controls['employeeId'].setValue("");
    this.employeeAttendanceForm.controls['date'].setValue("");
    this.employeeAttendanceForm.controls['state'].setValue("");
  }

  enableInputs() {
    this.employeeAttendanceForm.controls['id'].enable();
    this.employeeAttendanceForm.controls['employeeId'].enable();
    this.employeeAttendanceForm.controls['date'].enable();
    this.employeeAttendanceForm.controls['state'].enable();
  }

  deleteEmployeeAttendance(id) {
    this.service.deleteEmployeeAttendance(id)
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
              this.listEmployeeAttendance();
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
