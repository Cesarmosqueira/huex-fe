import { DatePipe } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { first } from 'rxjs/operators';
import { config } from 'src/app/shared/shared.config';
import Swal from 'sweetalert2';
import { Employee } from "../models/employee.model";
import { EmployeeService } from "../services/employee.service";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  idEmployeeOuput: number = 0;

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
  fileToUpload: any;
  imageUrl: any;
  fileList: FileList;
  myImageBaseUrl:string='../../../../../assets/images/huex/profile.jpg';

  constructor(public service: EmployeeService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder) {
    this.employeesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Empleados' }, { label: 'Trabajadores', active: true }];

    /**
     * Form Validation
     */
    this.employeeForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      fullName: ['', [Validators.required]],
      documentType: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      currentState: ['', [Validators.required]],
      placeOfBirth: ['', [Validators.required]],
      birthDate: [''],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      joinDate: ['', [Validators.required]],
      ceaseDate: ['', [Validators.required]],
      bankAccount: ['', [Validators.required]],
      contractType: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      pensionSystem: ['', [Validators.required]],
      childrens: [0, [Validators.required]],
      academicQualification: ['', [Validators.required]],
      criminalRecords: ['', [Validators.required]],
      kinhood: ['', [Validators.required]],
      kinFullName: ['', [Validators.required]],
      kinPhoneNumber: ['', [Validators.required]],
      salary: [0, [Validators.required]],
      role: ['', [Validators.required]],
      licenseCategory: ['', [Validators.required]],
      licenseExpirationDate: ['', [Validators.required]],
      dniExpirationDate: ['', [Validators.required]],
      photoUrl: ['', [Validators.required]],
      btnSave: []
    });

    this.employeesList.subscribe(x => {
      this.content = this.employees;
      this.employees = Object.assign([], x);
    });

    this.idEmployeeOuput = 0;

    this.listEmployees();
  }

  getImage(event) {
    if (event.target.files && event.target.files.length) {
      const file = (event.target.files[0] as File);
      this.employeeForm.get('photoUrl').setValue(file);
      this.fileList = event.target.files;
      this.fileToUpload = event.target.files.item(0);
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
  }

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


  openModal(content: any) {
    this.clear();
    this.submitted = false;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    };
    this.modalService.open(content, ngbModalOptions);
  }


  get form() {
    return this.employeeForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true;
    if (this.employeeForm.valid) {
      this.pipe = new DatePipe('en-US');
      const fullName = this.employeeForm.get('fullName')?.value;
      const documentType = this.employeeForm.get('documentType')?.value;
      const dni = this.employeeForm.get('dni')?.value;
      const currentState = this.employeeForm.get('currentState')?.value;
      const placeOfBirth = this.employeeForm.get('placeOfBirth')?.value;
      const birthDate = this.employeeForm.get('birthDate')?.value;
      const fortmatbirthDate = this.pipe.transform(birthDate, 'yyyy-MM-dd');
      const address = this.employeeForm.get('address')?.value;
      const phoneNumber = this.employeeForm.get('phoneNumber')?.value;
      const email = this.employeeForm.get('email')?.value;
      const joinDate = this.employeeForm.get('joinDate')?.value;
      const fortmatjoinDate = this.pipe.transform(joinDate, 'yyyy-MM-dd');
      const ceaseDate = this.employeeForm.get('ceaseDate')?.value;
      const fortmatceaseDate = this.pipe.transform(ceaseDate, 'yyyy-MM-dd');
      const bankAccount = this.employeeForm.get('bankAccount')?.value;
      const contractType = this.employeeForm.get('contractType')?.value;
      const maritalStatus = this.employeeForm.get('maritalStatus')?.value;
      const pensionSystem = this.employeeForm.get('pensionSystem')?.value;
      const childrens = this.employeeForm.get('childrens')?.value;
      const academicQualification = this.employeeForm.get('academicQualification')?.value;
      const criminalRecords = this.employeeForm.get('criminalRecords')?.value;
      const kinhood = this.employeeForm.get('kinhood')?.value;
      const kinFullName = this.employeeForm.get('kinFullName')?.value;
      const kinPhoneNumber = this.employeeForm.get('kinPhoneNumber')?.value;
      const salary = this.employeeForm.get('salary')?.value;
      const role = this.employeeForm.get('role')?.value;
      const licenseCategory = this.employeeForm.get('licenseCategory')?.value;
      const licenseExpirationDate = this.employeeForm.get('licenseExpirationDate')?.value;
      const fortmatlicenseExpirationDate = this.pipe.transform(licenseExpirationDate, 'yyyy-MM-dd');
      const dniExpirationDate = this.employeeForm.get('dniExpirationDate')?.value;
      const fortmatdniExpirationDate = this.pipe.transform(dniExpirationDate, 'yyyy-MM-dd');
      const photoUrl = this.imageUrl.replace("data:image/jpeg;base64,", "");

      let employee = new Employee();
      employee.fullName = fullName;
      employee.documentType = documentType;
      employee.dni = dni;
      employee.currentState = currentState;
      employee.placeOfBirth = placeOfBirth;
      employee.birthDate = fortmatbirthDate;
      employee.address = address;
      employee.phoneNumber = phoneNumber;
      employee.email = email;
      employee.joinDate = fortmatjoinDate;
      employee.ceaseDate = fortmatceaseDate;
      employee.bankAccount = bankAccount;
      employee.contractType = contractType;
      employee.maritalStatus = maritalStatus;
      employee.pensionSystem = pensionSystem;
      employee.childrens = childrens;
      employee.academicQualification = academicQualification;
      employee.criminalRecords = criminalRecords;
      employee.kinhood = kinhood;
      employee.kinFullName = kinFullName;
      employee.kinPhoneNumber = kinPhoneNumber;
      employee.salary = salary;
      employee.role = role;
      employee.licenseCategory = licenseCategory;
      employee.licenseExpirationDate = fortmatlicenseExpirationDate;
      employee.dniExpirationDate = fortmatdniExpirationDate;
      employee.photoUrl = photoUrl;

      const id = this.employeeForm.get('id')?.value;

      if (id == '0') {
        this.registerEmployee(employee);
      } else {
        employee.id = id;
        this.updateEmployee(employee);
      }

      this.imageUrl = null;

      this.modalService.dismissAll();
      setTimeout(() => {
        this.employeeForm.reset();
      }, 2000);

    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any, action: any) {
    this.imageUrl = null;
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    this.modalService.open(content, { size: 'xl', centered: true });
    if(action){
      var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
      modelTitle.innerHTML = 'Detalle Empleados';
      this.disableInputs();
      document.getElementById('add-btn').setAttribute("disabled","disabled");
    } else {
      this.enableInputs();
      document.getElementById('add-btn').removeAttribute("disabled");
      var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
      modelTitle.innerHTML = 'Actualizar Empleados';
      var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
      updateBtn.innerHTML = "Actualizar";
    }

    var listData = this.employees.filter((data: { id: any; }) => data.id === id);
    this.employeeForm.controls['id'].setValue(listData[0].id);
    this.employeeForm.controls['fullName'].setValue(listData[0].fullName);
    this.employeeForm.controls['documentType'].setValue(listData[0].documentType);
    this.employeeForm.controls['dni'].setValue(listData[0].dni);
    this.employeeForm.controls['currentState'].setValue(listData[0].currentState);
    this.employeeForm.controls['placeOfBirth'].setValue(listData[0].placeOfBirth);
    if(listData[0].birthDate!=null || listData[0].birthDate != undefined){
      const birthDate = listData[0].birthDate.substring(0, 10);
      const fortmatbirthDate = this.pipe.transform(birthDate, 'yyyy-MM-dd');
      this.employeeForm.controls['birthDate'].setValue(fortmatbirthDate);
    }
    this.employeeForm.controls['address'].setValue(listData[0].address);
    this.employeeForm.controls['phoneNumber'].setValue(listData[0].phoneNumber);
    this.employeeForm.controls['email'].setValue(listData[0].email);
    const joinDate = listData[0].joinDate.substring(0, 10);
    const fortmatjoinDate = this.pipe.transform(joinDate, 'yyyy-MM-dd');
    this.employeeForm.controls['joinDate'].setValue(fortmatjoinDate);
    const ceaseDate = listData[0].ceaseDate.substring(0, 10);
    const fortmatceaseDate = this.pipe.transform(ceaseDate, 'yyyy-MM-dd');
    this.employeeForm.controls['ceaseDate'].setValue(fortmatceaseDate);
    this.employeeForm.controls['bankAccount'].setValue(listData[0].bankAccount);
    this.employeeForm.controls['contractType'].setValue(listData[0].contractType);
    this.employeeForm.controls['maritalStatus'].setValue(listData[0].maritalStatus);
    this.employeeForm.controls['pensionSystem'].setValue(listData[0].pensionSystem);
    this.employeeForm.controls['childrens'].setValue(listData[0].childrens);
    this.employeeForm.controls['academicQualification'].setValue(listData[0].academicQualification);
    this.employeeForm.controls['criminalRecords'].setValue(listData[0].criminalRecords);
    this.employeeForm.controls['kinhood'].setValue(listData[0].kinhood);
    this.employeeForm.controls['kinFullName'].setValue(listData[0].kinFullName);
    this.employeeForm.controls['kinPhoneNumber'].setValue(listData[0].kinPhoneNumber);
    this.employeeForm.controls['salary'].setValue(listData[0].salary);
    this.employeeForm.controls['role'].setValue(listData[0].role);
    this.employeeForm.controls['licenseCategory'].setValue(listData[0].licenseCategory);
    const licenseExpirationDate = listData[0].licenseExpirationDate.substring(0, 10);
    const fortmatlicenseExpirationDate = this.pipe.transform(licenseExpirationDate, 'yyyy-MM-dd');
    this.employeeForm.controls['licenseExpirationDate'].setValue(fortmatlicenseExpirationDate);
    const dniExpirationDate = listData[0].dniExpirationDate.substring(0, 10);
    const fortmatdniExpirationDate = this.pipe.transform(dniExpirationDate, 'yyyy-MM-dd');
    this.employeeForm.controls['dniExpirationDate'].setValue(fortmatdniExpirationDate);
    this.imageUrl = 'data:image/jpeg;base64,' + listData[0].photoUrl;
    this.employeeForm.get('photoUrl').setValue(this.dataURLtoFile(this.imageUrl, 'foto.jpeg'));
    this.idEmployeeOuput = id;
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  listEmployees() {
    this.service.listEmployees()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.test = response.datos.employees;
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

  registerEmployee(employees) {
    this.service.registerEmployee(employees)
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
              const employeesDto = response.datos.employee;
              this.idEmployeeOuput = employeesDto.id;
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

  updateEmployee(employees) {
    this.service.updateEmployee(employees)
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
    this.employeeForm.controls['id'].setValue("0");
    this.employeeForm.controls['fullName'].setValue("");
    this.employeeForm.controls['documentType'].setValue("");
    this.employeeForm.controls['dni'].setValue("");
    this.employeeForm.controls['currentState'].setValue("");
    this.employeeForm.controls['placeOfBirth'].setValue("");
    this.employeeForm.controls['birthDate'].setValue("");
    this.employeeForm.controls['address'].setValue("");
    this.employeeForm.controls['phoneNumber'].setValue("");
    this.employeeForm.controls['email'].setValue("");
    this.employeeForm.controls['joinDate'].setValue("");
    this.employeeForm.controls['ceaseDate'].setValue("");
    this.employeeForm.controls['bankAccount'].setValue("");
    this.employeeForm.controls['contractType'].setValue("");
    this.employeeForm.controls['maritalStatus'].setValue("");
    this.employeeForm.controls['pensionSystem'].setValue("");
    this.employeeForm.controls['childrens'].setValue("");
    this.employeeForm.controls['academicQualification'].setValue("");
    this.employeeForm.controls['criminalRecords'].setValue("");
    this.employeeForm.controls['kinhood'].setValue("");
    this.employeeForm.controls['kinFullName'].setValue("");
    this.employeeForm.controls['kinPhoneNumber'].setValue("");
    this.employeeForm.controls['salary'].setValue("");
    this.employeeForm.controls['role'].setValue("");
    this.employeeForm.controls['licenseCategory'].setValue("");
    this.employeeForm.controls['licenseExpirationDate'].setValue("");
    this.employeeForm.controls['dniExpirationDate'].setValue("");
    this.employeeForm.controls['photoUrl'].setValue("");
    this.imageUrl = null;
  }

  disableInputs() {
    this.employeeForm.controls['id'].disable();
    this.employeeForm.controls['fullName'].disable();
    this.employeeForm.controls['documentType'].disable();
    this.employeeForm.controls['dni'].disable();
    this.employeeForm.controls['currentState'].disable();
    this.employeeForm.controls['placeOfBirth'].disable();
    this.employeeForm.controls['birthDate'].disable();
    this.employeeForm.controls['address'].disable();
    this.employeeForm.controls['phoneNumber'].disable();
    this.employeeForm.controls['email'].disable();
    this.employeeForm.controls['joinDate'].disable();
    this.employeeForm.controls['ceaseDate'].disable();
    this.employeeForm.controls['bankAccount'].disable();
    this.employeeForm.controls['contractType'].disable();
    this.employeeForm.controls['maritalStatus'].disable();
    this.employeeForm.controls['pensionSystem'].disable();
    this.employeeForm.controls['childrens'].disable();
    this.employeeForm.controls['academicQualification'].disable();
    this.employeeForm.controls['criminalRecords'].disable();
    this.employeeForm.controls['kinhood'].disable();
    this.employeeForm.controls['kinFullName'].disable();
    this.employeeForm.controls['kinPhoneNumber'].disable();
    this.employeeForm.controls['salary'].disable();
    this.employeeForm.controls['role'].disable();
    this.employeeForm.controls['licenseCategory'].disable();
    this.employeeForm.controls['licenseExpirationDate'].disable();
    this.employeeForm.controls['dniExpirationDate'].disable();
    this.employeeForm.controls['photoUrl'].disable();
  }

  enableInputs() {
    this.employeeForm.controls['id'].enable();
    this.employeeForm.controls['id'].enable();
    this.employeeForm.controls['fullName'].enable();
    this.employeeForm.controls['documentType'].enable();
    this.employeeForm.controls['dni'].enable();
    this.employeeForm.controls['currentState'].enable();
    this.employeeForm.controls['placeOfBirth'].enable();
    this.employeeForm.controls['birthDate'].enable();
    this.employeeForm.controls['address'].enable();
    this.employeeForm.controls['phoneNumber'].enable();
    this.employeeForm.controls['email'].enable();
    this.employeeForm.controls['joinDate'].enable();
    this.employeeForm.controls['ceaseDate'].enable();
    this.employeeForm.controls['bankAccount'].enable();
    this.employeeForm.controls['contractType'].enable();
    this.employeeForm.controls['maritalStatus'].enable();
    this.employeeForm.controls['pensionSystem'].enable();
    this.employeeForm.controls['childrens'].enable();
    this.employeeForm.controls['academicQualification'].enable();
    this.employeeForm.controls['criminalRecords'].enable();
    this.employeeForm.controls['kinhood'].enable();
    this.employeeForm.controls['kinFullName'].enable();
    this.employeeForm.controls['kinPhoneNumber'].enable();
    this.employeeForm.controls['salary'].enable();
    this.employeeForm.controls['role'].enable();
    this.employeeForm.controls['licenseCategory'].enable();
    this.employeeForm.controls['licenseExpirationDate'].enable();
    this.employeeForm.controls['dniExpirationDate'].enable();
    this.employeeForm.controls['photoUrl'].enable();
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
