import {DatePipe} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable} from "rxjs";
import {first} from 'rxjs/operators';
import {config} from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import {Employee} from "../models/employee.model";
import {EmployeeService} from "../services/employee.service";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  //

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  employeeForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  employees?: any;
  test: Employee[] = [];
  employeesList!: Observable<Employee[]>;
  total: Observable<number>;
  pipe: any;
  //

  constructor(public service: EmployeeService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder) {
    this.employeesList = service.countries$
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Trabajadores', active: true }];

    this.employeeForm = this.formBuilder.group({
      id:									    ['0', [Validators.required]],            
      fullName:						    ['', [Validators.required]],
      documentType:				    ['', [Validators.required]],
      dni:								    ['', [Validators.required]],
      currentState:				    ['', [Validators.required]],
      placeOfBirth:				    ['', [Validators.required]],
      birthDate:				      ['', [Validators.required]],
      address:						    ['', [Validators.required]],
      phoneNumber:				    ['', [Validators.required]],
      email:							    ['', [Validators.required]],
      joinDate:						    ['', [Validators.required]],
      ceaseDate:					    ['', [Validators.required]],
      bankAccount:				    ['', [Validators.required]],
      contractType:				    ['', [Validators.required]],            
      maritalStatus:			    ['', [Validators.required]],
      pensionSystem:			    ['', [Validators.required]],
      childrens:					    ['', [Validators.required]],
      academicQualification:  ['', [Validators.required]],
      criminalRecords:			  ['', [Validators.required]],
      salary:								  ['', [Validators.required]],
      role:									  ['', [Validators.required]],
      licenseCategory:			  ['', [Validators.required]],
      licenseExpirationDate:  ['', [Validators.required]],
      dniExpirationDate:		  ['', [Validators.required]],
  });                         

    this.employeesList.subscribe(x => {
      this.content = this.employees;
      this.employees = Object.assign([], x);
    });

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
          this.deleteEmployee(id);
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
    return this.employeeForm.controls;
  }

  /**
  * Save user
  */
  saveUser() {

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
    modelTitle.innerHTML = 'Actualizar Flota';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.employees.filter((data: { id: any; }) => data.id === id);
    const fabricationDate = listData[0].fabricationDate.substring(0, 10);
    const fortmatFabricationDate = this.pipe.transform(fabricationDate, 'yyyy-MM-dd');
    this.employeeForm.controls['id'].setValue(listData[0].id);
    this.employeeForm.controls['tractPlate'].setValue(listData[0].tractPlate);
    this.employeeForm.controls['vanPlate'].setValue(listData[0].vanPlate);
    this.employeeForm.controls['brand'].setValue(listData[0].brand);
    this.employeeForm.controls['volume'].setValue(listData[0].volume);
    this.employeeForm.controls['fabricationDate'].setValue(fortmatFabricationDate);
    this.employeeForm.controls['axes'].setValue(listData[0].axes);
    this.employeeForm.controls['model'].setValue(listData[0].model);
    this.employeeForm.controls['highWideLong'].setValue(listData[0].highWideLong);
    this.employeeForm.controls['fleetType'].setValue(listData[0].fleetType);
    this.employeeForm.controls['tonNumber'].setValue(listData[0].tonNumber);
  }

  listEmployees() {
    this.service.listEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.employeeDtoList;
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
              title: "Ocurrio un error, comuniquese con el Banco",
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

  registerEmployee(employee) {
    this.service.registerEmployee(employee)
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
              this.listEmployees();
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
              title: "Ocurrio un error, comuniquese con el Banco",
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

  updateEmployee(employee) {
    this.service.updateEmployee(employee)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.listEmployees();
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
              title: "Ocurrio un error, comuniquese con el Banco",
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

  deleteEmployee(id) {
    this.service.deleteEmployee(id)
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
              this.listEmployees();
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
              title: "Ocurrio un error, comuniquese con el Banco",
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
