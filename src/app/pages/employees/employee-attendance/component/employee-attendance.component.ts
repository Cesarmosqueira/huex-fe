import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {EmployeeAttendance} from "../models/employee-attendance.model";
import {EmployeeAttendanceService} from "../services/employee-attendance.service";

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {


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

  constructor(public service: EmployeeAttendanceService,
              private modalService: NgbModal,
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
      date: ['', [Validators.required]],
      state: ['', [Validators.required]],
      employee_id: ['', [Validators.required]],
    });

    this.employeeAttendanceList.subscribe(x => {
      this.content = this.employeeAttendanceList;
      this.employeeAttendance = Object.assign([], x);
    });

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
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
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
      const date = this.employeeAttendanceForm.get('date')?.value;
      const state = this.employeeAttendanceForm.get('state')?.value;
      const employee_id = this.employeeAttendanceForm.get('employee_id')?.value;

      let employeeAttendance = new EmployeeAttendance();
      employeeAttendance.date = date;
      employeeAttendance.state = state;
      employeeAttendance.employee_id = employee_id;
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
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar Asistencia trabajador';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.employeeAttendance.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.employeeAttendanceForm.controls['id'].setValue(listData[0].id);
    this.employeeAttendanceForm.controls['date'].setValue(fortmatFabricationDate);
    this.employeeAttendanceForm.controls['state'].setValue(listData[0].state);
    this.employeeAttendanceForm.controls['employee_id'].setValue(listData[0].employee_id);
  }

  listEmployeeAttendance() {
    this.service.listEmployeeAttendance()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.employeeAttendanceDtoList;
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
              this.employeeAttendance();
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

  updateEmployeeAttendance(employeeAttendance) {
    this.service.updateEmployeeAttendance(employeeAttendance)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
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
