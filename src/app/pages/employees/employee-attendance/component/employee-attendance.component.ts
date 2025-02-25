import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {config} from "../../../../shared/shared.config";
import {EmployeeAttendance} from "../models/employee-attendance.model";
import {EmployeeAttendanceService} from "../services/employee-attendance.service";
import {Employee} from "../../employee/models/employee.model";
import {EmployeeService} from "../../employee/services/employee.service";
import { CustomDatepickerI18n, I18n } from '../services/date-picker-format.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss'],
  providers: [
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
  ],
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
  selectEmployee:any;

  //startDate
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  date: string;

  constructor(public service: EmployeeAttendanceService,
              private modalService: NgbModal,
              private serviceEmployee:EmployeeService,
              private formBuilder: UntypedFormBuilder,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter) {
    this.employeeAttendanceList = service.countries$;
    this.total = service.total$;
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();
    this.date = this.formatter.format(this.fromDate) + " / " + this.formatter.format(this.toDate);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Asistencia', active: true }];

    /**
     * Form Validation
     */
    this.employeeAttendanceForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      employee: ['', [Validators.required]],
      attendanceDate: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });

    this.employeeAttendanceList.subscribe(x => {
      this.content = this.employeeAttendance;
      this.employeeAttendance = Object.assign([], x);
    });
    this.idEmployeeAttendanceOuput = 0;

    this.listEmployees();
    
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
    this.submitted = false;
    this.enableInputs();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'md'
    };
    this.selectEmployee=null;
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
      const employeeId = this.selectEmployee.id;
      const attendanceDate = this.employeeAttendanceForm.get('attendanceDate')?.value;
      const fortmatattendanceDate = this.pipe.transform(attendanceDate, 'yyyy-MM-ddTHH:mm:ss.sssZ');
      const status = this.employeeAttendanceForm.get('status')?.value;

      let employeeAttendance = new EmployeeAttendance();
      let employee=new Employee();
      employee.id=employeeId;
      employeeAttendance.employee = employee;
      employeeAttendance.attendanceDate = fortmatattendanceDate;
      employeeAttendance.status = status;

      const id = this.employeeAttendanceForm.get('id')?.value;

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
    const attendanceDate = listData[0].attendanceDate.substring(0, 10);
    const fortmatattendanceDate = this.pipe.transform(attendanceDate, 'yyyy-MM-dd');
    this.employeeAttendanceForm.controls['id'].setValue(listData[0].id);
    this.employeeAttendanceForm.controls['attendanceDate'].setValue(fortmatattendanceDate);
    this.employeeAttendanceForm.controls['status'].setValue(listData[0].status);
    this.selectEmployee=listData[0].employee;

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

  listEmployeeAttendanceByDate(startDate, endDate) {
    this.service.listEmployeeAttendanceByDate(startDate, endDate)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.attendances;
              this.service.paginationTable(this.test);
            } else {
              this.test = [];
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
    this.employeeAttendanceForm.controls['employee'].setValue("");
    this.employeeAttendanceForm.controls['attendanceDate'].setValue("");
    this.employeeAttendanceForm.controls['status'].setValue("");
  }

  enableInputs() {
    this.employeeAttendanceForm.controls['id'].enable();
    this.employeeAttendanceForm.controls['employee'].enable();
    this.employeeAttendanceForm.controls['attendanceDate'].enable();
    this.employeeAttendanceForm.controls['status'].enable();
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

  searchEmployeeAttendance(){
    let startDate = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
    let endDate = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day
    this.listEmployeeAttendanceByDate(startDate, endDate);
  }

  //rangeDate
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.date = this.formatter.format(this.fromDate) + " - " + this.formatter.format(this.toDate);
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

}
